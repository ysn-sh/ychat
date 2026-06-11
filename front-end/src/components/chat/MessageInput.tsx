import { useState, type KeyboardEvent } from "react";
import { useChatContext } from "@/context/ChatContext";
import { EmojiPicker } from "./EmojiPicker";
import { FileUpload } from "./FileUpload";
import "./MessageInput.css";

export function MessageInput() {
  const [text, setText] = useState("");
  const { sendMessage, activeConversation, isConnected } = useChatContext();

  const handleSend = () => {
    if (!text.trim() || !activeConversation || !isConnected) return;
    sendMessage(activeConversation.id, text.trim());
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeConversation) return null;

  return (
    <div className="message-input-container">
      <div className="message-input-actions">
        <EmojiPicker onEmojiSelect={(emoji) => setText(prev => prev + emoji)} />
        <FileUpload onFileSelect={(file) => console.log("Upload", file)} />
      </div>
      <textarea
        className="message-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={!isConnected}
      />
      <button
        className="message-send"
        onClick={handleSend}
        disabled={!text.trim() || !isConnected}
      >
        Send
      </button>
    </div>
  );
}