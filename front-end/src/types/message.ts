export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: {
    id: string;
    username: string;
    displayName?: string | null;
    avatarHash?: string | null;
  };
  contentType: 'text' | 'voice' | 'video' | 'image' | 'file';
  content?: string | null;
  mediaHash?: string | null;
  mediaMetadata?: any;
  replyTo?: string | null;
  editedAt?: string | null;
  createdAt?: string;
  timestamp?: number;
}