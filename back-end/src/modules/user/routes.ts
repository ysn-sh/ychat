import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '@/shared/utils/authHook';
import { authService } from '@/modules/auth/service';
import { pool } from '@/infrastructure/db/pool';

export async function userRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.get('/me', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).userId;
    const user = await authService.getUserById(userId);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    return reply.send(user);
  });

  app.get('/search', async (req: FastifyRequest, reply: FastifyReply) => {
    const { q } = req.query as { q?: string };
    if (!q || q.trim().length === 0) return reply.send([]);

    try {
        const result = await pool.query(
        `SELECT id, username, display_name, avatar_hash 
        FROM users 
        WHERE username ILIKE $1 
        AND id != $2 
        LIMIT 10`,
        [`%${q}%`, (req as any).userId]
        );
        return reply.send(result.rows.map(row => ({
        id: row.id,
        username: row.username,
        displayName: row.display_name,
        avatarHash: row.avatar_hash,
        })));
    } catch (err) {
        return reply.status(500).send({ error: 'Search failed' });
    }
  });
}