import { type ReactNode } from "react";
import { ChatProvider } from "@/context/ChatContext";
import { Sidebar } from "@/components/chat/sidebar/Sidebar";
import "./ChatLayout.css";

interface ChatLayoutProps {
  children: ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <ChatProvider>
      <div className="chat-layout">
        <Sidebar />
        <div className="chat-main">{children}</div>
      </div>
    </ChatProvider>
  );
}