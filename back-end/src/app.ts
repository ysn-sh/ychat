import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import { env } from '@/config/env';

import { authRoutes } from '@/modules/auth/routes';
import { conversationRoutes } from '@/modules/chat/conversations/routes';
import { messageRoutes } from '@/modules/chat/messages/routes';
import { configureWebSocket } from '@/infrastructure/ws/wsHandler';
import { connectRedis } from '@/infrastructure/cache/redis';
import { userRoutes } from './modules/user/routes';

async function buildServer() {
  const app = Fastify({ logger: true });

  // Connect Redis
  await connectRedis();

  // Plugins
  await app.register(fastifyCookie, { secret: env.JWT_REFRESH_SECRET });
  await app.register(fastifyCors, { origin: true, credentials: true });
  await app.register(fastifyWebsocket);

  // Register routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(conversationRoutes, { prefix: '/api/conversations' });
  await app.register(messageRoutes, { prefix: '/api' });
  await app.register(userRoutes, { prefix: '/api/users' });
  // WebSocket
  configureWebSocket(app);

  // Health
  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}

async function start() {
  const app = await buildServer();
  try {
    await app.listen({ port: parseInt(env.PORT, 10), host: env.HOST });
    app.log.info(`Server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();