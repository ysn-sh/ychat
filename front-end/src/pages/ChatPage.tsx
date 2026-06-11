import { ChatLayout } from "@/layouts/ChatLayout";
import { ChatWindow } from "@/components/chat/ChatWindow";

export function ChatPage() {
  return (
    <ChatLayout>
      <ChatWindow />
    </ChatLayout>
  );
}