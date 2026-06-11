import { pool } from '@/infrastructure/db/pool';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: {
    id: string;
    username: string;
    displayName: string | null;
    avatarHash: string | null;
  };
  contentType: 'text' | 'voice' | 'video' | 'image' | 'file';
  content: string | null;
  mediaHash: string | null;
  mediaMetadata: any;
  replyTo: string | null;
  editedAt: Date | null;
  createdAt: Date;
}
export class MessageRepository {
  async create(
    conversationId: string,
    senderId: string,
    data: {
      contentType: string;
      content?: string;
      mediaHash?: string;
      mediaMetadata?: any;
      replyTo?: string;
    }
  ): Promise<Message> {
    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, content_type, content, media_hash, media_metadata, reply_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [conversationId, senderId, data.contentType, data.content || null, data.mediaHash || null, data.mediaMetadata || null, data.replyTo || null]
    );
  
    // Fetch the sender details for the returned message
    const messageRow = result.rows[0];
    const userResult = await pool.query('SELECT id, username, display_name, avatar_hash FROM users WHERE id = $1', [senderId]);
    const sender = userResult.rows[0];
    return {
      ...this.mapMessage(messageRow),
      sender: sender ? {
        id: sender.id,
        username: sender.username,
        displayName: sender.display_name,
        avatarHash: sender.avatar_hash,
      } : undefined,
    };
  }

  async findByConversation(
    conversationId: string,
    options: { before?: string; limit?: number } = {}
  ): Promise<Message[]> {
    const { before, limit = 50 } = options;
    let query = `
      SELECT
        m.*,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'displayName', u.display_name,
          'avatarHash', u.avatar_hash
        ) AS sender
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = $1
    `;
    const params: any[] = [conversationId];

    if (before) {
      query += ` AND m.created_at < (SELECT created_at FROM messages WHERE id = $${params.length + 1})`;
      params.push(before);
    }

    query += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    // Return in chronological order (oldest first)
    return result.rows.map(this.mapMessage).reverse();
  }

  async markRead(messageId: string, userId: string): Promise<void> {
    await pool.query(
      `INSERT INTO message_reads (message_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [messageId, userId]
    );
  }

  private mapMessage(row: any): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    sender: row.sender,
    contentType: row.content_type,
    content: row.content,
    mediaHash: row.media_hash,
    mediaMetadata: row.media_metadata,
    replyTo: row.reply_to,
    editedAt: row.edited_at,
    createdAt: row.created_at,
  };
}
}

export const messageRepository = new MessageRepository();