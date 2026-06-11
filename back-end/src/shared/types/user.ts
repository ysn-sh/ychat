export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarHash: string | null;
  statusLastSeen: Date | null;
  createdAt: Date;
}