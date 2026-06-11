import { ConversationItem } from "./ConversationItem";
import type { Conversation } from "@/types/conversation";
import "./ConversationList.css";

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return <div className="empty-conversations">
      <div>No conversations yet</div>
      <a className="CTA" href="#">
        Start a new conversation</a>
      </div>;
  }

  return (
    <div className="conversation-list">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={activeId === conv.id}
          onClick={() => onSelect(conv)}
        />
      ))}
    </div>
  );
}