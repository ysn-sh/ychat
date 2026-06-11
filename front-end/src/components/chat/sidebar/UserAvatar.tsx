
import { useAuth } from "@/hooks/useAuth";
import "./UserAvatar.css";

interface UserAvatarProps {
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