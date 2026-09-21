
import { useAuth } from "@/hooks/useAuth";
import "./UserAvatar.css";
import type { User } from "@/types/user";
import { redirect } from "react-router-dom";

interface UserAvatarProps {
  user: User,
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ size = "md" }: UserAvatarProps) {
  const { user } = useAuth();
  const initial = user?.username?.[0]?.toUpperCase() || "?";

  const HandleAvatarClicked = () => {
    redirect("/Profile");
  }
  return (
    <button
      className={`user-avatar user-avatar--${size}`}
      onClick={HandleAvatarClicked}>
      {initial}
    </button>
  );
}