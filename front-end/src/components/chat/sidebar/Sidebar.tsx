import { useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import { SearchConversations } from "./SearchConversations";
import { ConversationList } from "./ConversationList";
import { UserAvatar } from "./UserAvatar";
import { NewConversationModal } from "../NewConversationModal";
import "./Sidebar.css";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const { conversations, activeConversation, setActiveConversation } = useChatContext();
  const [ isNewChatOpen, setIsNewChatOpen ] = useState(false);
  const { user } = useAuth()
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <UserAvatar user={user!} size="md" />
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