import { useAuth } from "@/hooks/useAuth";
import type { Message } from "@/types/message";
import { formatTime } from "@/utils/formatTime";
import "./MessageItem.css";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { user } = useAuth();
  const isOwn = user?.id === message.sender?.id;

  return (
    <div className={`message-item ${isOwn ? "message-item--own" : "message-item--other"}`}>
      {!isOwn && (
        <div className="message-avatar">
          <span>{message.sender?.username?.[0] || "?"}</span>
        </div>
      )}
      <div className="message-bubble">
        {!isOwn && <div className="message-sender">{message.sender?.username}</div>}
        <div className="message-content">{message.content}</div>
        <div className="message-time">{formatTime(message.timestamp || 0)}</div>
      </div>
    </div>
  );
}