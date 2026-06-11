import { useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import { SearchConversations } from "./SearchConversations";
import { ConversationList } from "./ConversationList";
import { UserAvatar } from "./UserAvatar";
import { NewConversationModal } from "../NewConversationModal";
import "./Sidebar.css";

export function Sidebar() {
  const { conversations, activeConversation, setActiveConversation } = useChatContext();
  const [ isNewChatOpen, setIsNewChatOpen ] = useState(false);
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <UserAvatar size="md" />
        <SearchConversations />
      </div>
      <ConversationList
        conversations={conversations}
        activeId={activeConversation?.id}
        onSelect={setActiveConversation}
      />
       <button
      onClick={() => setIsNewChatOpen(true)}
      style={{ margin: "0.5rem", padding: "0.5rem", width: "100%" }}
    >
      + New Conversation
    </button>

    <NewConversationModal
      isOpen={isNewChatOpen}
      onClose={() => setIsNewChatOpen(false)}
    />
    </div>
  );
}