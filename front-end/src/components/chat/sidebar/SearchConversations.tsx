import { useState } from "react";
// import { useChatContext } from "@/context/ChatContext";
// import { useDebounce } from "@/hooks/useDebounce";
import "./SearchConversations.css";

export function SearchConversations() {
  const [query, setQuery] = useState("");
  // const debouncedQuery = useDebounce(query, 300);
  // const { conversations } = useChatContext();


  return (
    <div className="search-conversations">
      <input
        type="text"
        placeholder="Search conversations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
    </div>
  );
}