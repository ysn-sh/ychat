import { useChatContext } from "@/context/ChatContext";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";

export function ChatWindow() {
  const { activeConversation } = useChatContext();

  if (!activeConversation) {
    return <div className="no-conversation" 
    style={{display: "flex",
    height:"100%", 
    alignItems:"center", 
    justifyContent:"center",
    backgroundColor: "var(--bg-dark)"}}>
        <div>Select a conversation to start chatting</div>
        </div>;
  }

  return (
    <>
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </>
  );
}