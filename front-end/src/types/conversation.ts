import { type Message } from "./message";

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name?: string | null;
  avatarHash?: string | null;
  participants?: {
    id: string;
    username: string;
    displayName?: string | null;
    avatarHash?: string | null;
  }[];
  messages?: Message[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt?: string;
}