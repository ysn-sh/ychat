import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { conversationService } from '@/modules/chat/conversations/service';
import redis, { pubRedis } from '@/infrastructure/cache/redis';

interface AuthenticatedSocket {
  userId: string;
  socket: WebSocket;
}

const connectedSockets: Map<string, AuthenticatedSocket[]> = new Map();

export function configureWebSocket(app: FastifyInstance) {
  app.register(async function (app) {
    app.get('/ws', { websocket: true }, (socket, req) => {
      let userId: string | null = null;

      // Make the callback async so we can await service calls
      socket.on('message', async (raw: Buffer) => {
        try {
          const msg = JSON.parse(raw.toString());

          // Authentication
          if (msg.type === 'auth') {
            const token = msg.token;
            const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
            userId = payload.sub;

            if (!userId) {
              socket.send(JSON.stringify({ event: 'error', payload: { message: 'Invalid token: no subject' } }));
              return;
            }

            (socket as any).userId = userId;

            if (!connectedSockets.has(userId)) {
              connectedSockets.set(userId, []);
            }
            connectedSockets.get(userId)!.push({ userId, socket });

            redis.subscribe(`user:${userId}`);
            console.log(`User ${userId} connected via WebSocket`);

            socket.send(JSON.stringify({ event: 'auth.success', payload: {} }));

            const redisListener = (channel: string, message: string) => {
              if (channel === `user:${userId}`) {
                socket.send(message);
              }
            };
            redis.on('message', redisListener);

            socket.on('close', () => {
              if (userId) {
                const userSockets = connectedSockets.get(userId);
                if (userSockets) {
                  const index = userSockets.findIndex(s => s.socket === socket);
                  if (index !== -1) userSockets.splice(index, 1);
                  if (userSockets.length === 0) connectedSockets.delete(userId);
                }
                redis.unsubscribe(`user:${userId}`);
                redis.off('message', redisListener);
              }
            });
          }
          // Not authenticated yet
          else if (!userId) {
            socket.send(JSON.stringify({ event: 'error', payload: { message: 'Not authenticated. Send auth message first.' } }));
          }
          // Authenticated – handle other events
          else {
            // Typing indicator
            if (msg.event === 'typing.start' || msg.event === 'typing.stop') {
              const { conversationId } = msg.payload;
              const typingEvent = JSON.stringify({
                event: 'typing',
                payload: { conversationId, userId, isTyping: msg.event === 'typing.start' },
              });
              try {
                const participants = await conversationService.getParticipants(conversationId);
                for (const pId of participants) {
                  await pubRedis.publish(`user:${pId}`, typingEvent);
                }
              } catch (err) {
                // Conversation might not exist; ignore
                console.error('Typing publish error:', err);
              }
            }
            // Presence ping
            else if (msg.event === 'presence.ping') {
              redis.set(`presence:${userId}`, 'online', 'EX', 30);
              try {
                await conversationService.broadcastPresence(userId, 'online');
              } catch (err) {
                console.error('Presence broadcast error:', err);
              }
            }
          }
        } catch (err) {
          socket.send(JSON.stringify({ event: 'error', payload: { message: 'Invalid message format or token' } }));
        }
      });

      // Socket close handler – delayed offline broadcast
      socket.on('close', () => {
        if (userId) {
          const currentUserId = userId;
          setTimeout(async () => {
            const sockets = connectedSockets.get(currentUserId);
            if (!sockets || sockets.length === 0) {
              await redis.set(`presence:${currentUserId}`, 'offline');
              try {
                await conversationService.broadcastPresence(currentUserId, 'offline');
              } catch (err) {
                console.error('Offline broadcast error:', err);
              }
            }
          }, 10000);
        }
      });
    });
  });
}