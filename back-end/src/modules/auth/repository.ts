import { pool } from '@/infrastructure/db/pool';
import { User } from '@/shared/types/user';

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    return this.mapUser(result.rows[0]);
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return null;
    return this.mapUser(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapUser(result.rows[0]);
  }

  async create(data: {
    username: string;
    email: string;
    passwordHash: string;
    displayName?: string;
  }): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, display_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.username, data.email, data.passwordHash, data.displayName || null]
    );
    return this.mapUser(result.rows[0]);
  }

  async getPasswordHash(userId: string): Promise<string | null> {
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    return result.rows[0]?.password_hash || null;
  }
  
  private mapUser(row: any): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      displayName: row.display_name,
      avatarHash: row.avatar_hash,
      statusLastSeen: row.status_last_seen,
      createdAt: row.created_at,
    };
  }
}

export const authRepository = new AuthRepository();