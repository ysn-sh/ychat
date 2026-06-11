import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useWS } from "@/context/WebSocketContext";
import { useAuth } from "@/hooks/useAuth";
import { conversationsApi } from "@/api/conversations";
import { messagesApi } from "@/api/messages";
import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";

interface ChatContextType {
  conversations: Conversation[];
  activeConversation?: Conversation;
  messages: Message[];
  sendMessage: (conversationId: string, content: string) => void;
  setActiveConversation: (conversation: Conversation) => void;
  markAsRead: (conversationId: string) => void;
  refreshConversations: () => Promise<void>;
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { subscribe, sendEvent, isConnected } = useWS();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const refreshConversations = useCallback(async () => {
    try {
      const list = await conversationsApi.list();
      setConversations(list);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  }, []);

  useEffect(() => {
    if (user) refreshConversations();
  }, [user, refreshConversations]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }
    (async () => {
      try {
        const msgs = await messagesApi.getHistory(activeConversationId);
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    })();
  }, [activeConversationId]);

  // Idempotent handler for new messages
  useEffect(() => {
    const unsub = subscribe("message.new", (payload: any) => {
      const { conversationId, message } = payload;

      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: message,
              unreadCount: activeConversationId === conversationId
                ? conv.unreadCount
                : (conv.unreadCount || 0) + 1,
            };
          }
          return conv;
        })
      );

      if (conversationId === activeConversationId) {
        setMessages(prev => {
          // Prevent duplicate messages in the active conversation
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    });
    return unsub;
  }, [subscribe, activeConversationId]);

  useEffect(() => {
    const unsub = subscribe("conversation.created", (payload: any) => {
      const { conversation } = payload;
      setConversations(prev => {
        if (prev.some(c => c.id === conversation.id)) return prev;
        return [conversation, ...prev];
      });
    });
    return unsub;
  }, [subscribe]);

  const setActiveConversation = useCallback((conversation: Conversation) => {
    setActiveConversationId(conversation.id);
    if (conversation.unreadCount && conversation.unreadCount > 0) {
      sendEvent("markAsRead", { conversationId: conversation.id });
    }
  }, [sendEvent]);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      await messagesApi.send(conversationId, { contentType: "text", content });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
    sendEvent("markAsRead", { conversationId });
  }, [sendEvent]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        sendMessage,
        setActiveConversation,
        markAsRead,
        refreshConversations,
        isConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within ChatProvider");
  return context;
}