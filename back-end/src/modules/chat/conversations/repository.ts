import { pool } from '@/infrastructure/db/pool';

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name: string | null;
  avatarHash: string | null;
  participants?: {
    id: string;
    username: string;
    displayName: string | null;
    avatarHash: string | null;
  }[];
  createdAt: Date;
}

export class ConversationRepository {
  async createDirect(userId1: string, userId2: string): Promise<Conversation> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Create conversation
      const convResult = await client.query(
        `INSERT INTO conversations (type) VALUES ('direct') RETURNING *`
      );
      const conversation = convResult.rows[0];
      // Add both users
      await client.query(
        `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)`,
        [conversation.id, userId1, userId2]
      );
      await client.query('COMMIT');
      return this.mapConversation(conversation);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<Conversation | null> {
    const result = await pool.query('SELECT * FROM conversations WHERE id = $1', [id]);
    return result.rows[0] ? this.mapConversation(result.rows[0]) : null;
  }

  async findByUser(userId: string): Promise<Conversation[]> {
    const result = await pool.query(
      `SELECT c.*,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', u.id,
                    'username', u.username,
                    'displayName', u.display_name,
                    'avatarHash', u.avatar_hash
                  )
                ) FILTER (WHERE u.id IS NOT NULL), '[]'
              ) AS participants
       FROM conversations c
       JOIN conversation_participants cp ON cp.conversation_id = c.id
       LEFT JOIN users u ON u.id = cp.user_id
       WHERE cp.conversation_id IN (
         SELECT conversation_id FROM conversation_participants WHERE user_id = $1
       )
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return result.rows.map(this.mapConversation);
  }

  async getParticipants(conversationId: string): Promise<string[]> {
    const result = await pool.query(
      'SELECT user_id FROM conversation_participants WHERE conversation_id = $1',
      [conversationId]
    );
    return result.rows.map((r) => r.user_id);
  }

  async addParticipant(conversationId: string, userId: string): Promise<void> {
    await pool.query(
      'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [conversationId, userId]
    );
  }

  async removeParticipant(conversationId: string, userId: string): Promise<void> {
    await pool.query(
      'DELETE FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
      [conversationId, userId]
    );
  }

  private mapConversation(row: any): Conversation {
    return {
      id: row.id,
      type: row.type,
      name: row.name,
      avatarHash: row.avatar_hash,
      participants: row.participants,
      createdAt: row.created_at,
    };
  }

  async createGroup(name: string, participantIds: string[]): Promise<Conversation> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const convResult = await client.query(
        `INSERT INTO conversations (type, name) VALUES ('group', $1) RETURNING *`,
        [name]
        );
        const conversation = convResult.rows[0];
        for (const userId of participantIds) {
        await client.query(
            `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)`,
            [conversation.id, userId]
        );
        }
        await client.query('COMMIT');
        return this.mapConversation(conversation);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
  }

  async getContactIds(userId: string): Promise<string[]> {
    const result = await pool.query(
        `SELECT DISTINCT cp.user_id
        FROM conversation_participants cp
        WHERE cp.conversation_id IN (
        SELECT conversation_id FROM conversation_participants WHERE user_id = $1
        )
        AND cp.user_id != $1`,
        [userId]
    );
    return result.rows.map(r => r.user_id);
    }
}

export const conversationRepository = new ConversationRepository();