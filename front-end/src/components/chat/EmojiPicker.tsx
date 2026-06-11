import { useState } from "react";
import "./EmojiPicker.css";

const EMOJIS = ["😀", "😂", "😍", "🥲", "😎", "👍", "❤️", "🔥", "🎉", "🚀", "✨", "💀"];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="emoji-picker-container">
      <button className="emoji-picker-trigger" onClick={() => setIsOpen(!isOpen)}>
        😀
      </button>
      {isOpen && (
        <div className="emoji-picker-dropdown">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              className="emoji-option"
              onClick={() => {
                onEmojiSelect(emoji);
                setIsOpen(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}