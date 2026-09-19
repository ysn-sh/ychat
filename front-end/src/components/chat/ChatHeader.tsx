import { useChatContext } from "@/context/ChatContext";
import "./ChatHeader.css";

export function ChatHeader() {
  const { activeConversation } = useChatContext();

  if (!activeConversation) return null;
  if (!activeConversation.participants) return null;
  
  const participantNames = activeConversation.participants
    .map(p => p.username)
    .join(", ");

  return (
    <div className="chat-header">
      <div className="chat-header__info">
        <h3 className="chat-header__title">{participantNames}</h3>
        <span className="chat-header__status">Online</span> {/* placeholder */}
      </div>
    </div>
  );
}