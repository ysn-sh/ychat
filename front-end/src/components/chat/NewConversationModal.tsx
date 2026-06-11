import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Spinner } from "@/components/common/Spinner";
import { conversationsApi } from "@/api/conversations";
import { usersApi } from "@/api/users";
import { useChatContext } from "@/context/ChatContext";

interface UserResult {
  id: string;
  username: string;
  displayName: string | null;
  avatarHash: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NewConversationModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { refreshConversations, setActiveConversation } = useChatContext();

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await usersApi.search(value);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async (userId: string) => {
    try {
        const conversation = await conversationsApi.createDirect(userId);
        await refreshConversations();
        setActiveConversation(conversation);
        onClose();
        setQuery("");
        setResults([]);
    } catch (err: any) {
        setError(err.response?.data?.error || "Could not start conversation");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
        <h2 style={{ margin: 0 }}>New Conversation</h2>
        <Input
          placeholder="Search by username..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          autoFocus
        />
        {loading && <Spinner />}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {results.map((user) => (
          <div
            key={user.id}
            onClick={() => startConversation(user.id)}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <strong>{user.displayName || user.username}</strong>
            <span style={{ color: "var(--text-muted)" }}>@{user.username}</span>
          </div>
        ))}
        {!loading && query.length >= 2 && results.length === 0 && (
          <p>No users found</p>
        )}
      </div>
    </Modal>
  );
}