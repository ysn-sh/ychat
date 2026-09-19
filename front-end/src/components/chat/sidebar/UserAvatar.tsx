
import { useAuth } from "@/hooks/useAuth";
import "./UserAvatar.css";
import type { User } from "@/types/user";

interface UserAvatarProps {
  user: User,
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ size = "md" }: UserAvatarProps) {
  const { user } = useAuth();
  const initial = user?.username?.[0]?.toUpperCase() || "?";

  return (
    <div className={`user-avatar user-avatar--${size}`}>
      {initial}
    </div>
  );
}