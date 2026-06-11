import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authService } from './service';
import { registerSchema, loginSchema } from '@/shared/utils/validation';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (req: FastifyRequest, reply: FastifyReply) => {
    const data = registerSchema.parse(req.body);
    try {
      const result = await authService.register(data);
      // Set refresh token as httpOnly cookie
      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60,
      });
      return reply.code(201).send({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  });

  app.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = loginSchema.parse(req.body);
    try {
      const result = await authService.login(email, password);
      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60,
      });
      return reply.send({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (err: any) {
      return reply.code(401).send({ error: err.message });
    }
  });

  app.post('/refresh', async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.refreshToken;
    if (!token) return reply.code(401).send({ error: 'No refresh token' });
    try {
        const payload = authService.verifyRefreshToken(token);
        const user = await authService.getUserById(payload.sub);
        if (!user) return reply.code(401).send({ error: 'User not found' });
        const accessToken = authService.generateAccessToken(user);
        return reply.send({ accessToken });
    } catch (err: any) {
        return reply.code(401).send({ error: err.message });
    }
  });

  app.post('/logout', async (_req: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    return reply.send({ success: true });
  });
}