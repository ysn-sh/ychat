import type { Conversation } from "@/types/conversation";
import { useAuth } from "@/hooks/useAuth";
import "./ConversationItem.css";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const { user } = useAuth();
  const otherParticipant = conversation.participants?.find(p => p.id !== user?.id) ?? conversation.participants?.[0];
  const conversationName = conversation.name || otherParticipant?.username || "Unknown";
  const lastMessage = conversation.lastMessage?.content || "No messages yet";
  const time = conversation.lastMessage?.timestamp
    ? new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "";

  return (
    <div
      className={`conversation-item ${isActive ? "conversation-item--active" : ""}`}
      onClick={onClick}
    >
      <div className="conversation-avatar">
        {otherParticipant?.username?.toUpperCase()?.[0] || "?"}
      </div>
      <div className="conversation-info">
        <div className="conversation-name">{conversationName}</div>
        <div className="conversation-last-message">{lastMessage}</div>
      </div>
      <div className="conversation-meta">
        <div className="conversation-time">{time}</div>
        {conversation.unreadCount ? (
          <div className="conversation-unread">{conversation.unreadCount}</div>
        ) : null}
      </div>
    </div>
  );
}