import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { authRepository } from './repository';
import { User } from '@/shared/types/user';

export class AuthService {
  async register(dto: {
    username: string;
    email: string;
    password: string;
    displayName?: string;
  }) {
    // Check if user exists
    const existingEmail = await authRepository.findByEmail(dto.email);
    if (existingEmail) throw new Error('Email already in use');
    const existingUsername = await authRepository.findByUsername(dto.username);
    if (existingUsername) throw new Error('Username already taken');

    const saltRounds = parseInt(env.BCRYPT_SALT_ROUNDS, 10);
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);
    const user = await authRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
    });

    const tokens = this.generateTokens(user);
    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const passwordHash = await authRepository.getPasswordHash(user.id);
    if (!passwordHash) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const tokens = this.generateTokens(user);
    return { user, ...tokens };
  }

  generateTokens(user: User) {
    const accessToken = jwt.sign(
      { sub: user.id, username: user.username },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any }
    );
    const refreshToken = jwt.sign(
      { sub: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
    );
    return { accessToken, refreshToken };
  }

  generateAccessToken(user: User): string {
    return jwt.sign(
      { sub: user.id, username: user.username },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any }
    );
  }
  verifyRefreshToken(token: string): { sub: string } {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
      return payload;
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    return authRepository.findById(id);
  }
}

export const authService = new AuthService();