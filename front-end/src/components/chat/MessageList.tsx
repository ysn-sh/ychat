import { useRef, useEffect } from "react";
import { useChatContext } from "@/context/ChatContext";
import { MessageItem } from "./MessageItem";
import { DateSeparator } from "./DateSeparator";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import "./MessageList.css";

export function MessageList() {
  const { messages, activeConversation } = useChatContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollToBottom } = useAutoScroll(containerRef, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!activeConversation) return null;

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="message-list" ref={containerRef}>
      {grouped.map(([date, msgs]) => (
        <div key={date}>
          <DateSeparator date={date} />
          {msgs.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </div>
      ))}
    </div>
  );
}

function groupMessagesByDate(messages: any[]) {
  const groups: [string, any[]][] = [];
  messages.forEach(msg => {
    const date = new Date(msg.timestamp).toDateString();
    const last = groups[groups.length - 1];
    if (last && last[0] === date) last[1].push(msg);
    else groups.push([date, [msg]]);
  });
  return groups;
}