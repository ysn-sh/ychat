CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  avatar_hash TEXT,
  status_last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(10) NOT NULL
    CHECK (type IN ('direct', 'group', 'channel')),
  name TEXT,
  avatar_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE conversation_participants (
  conversation_id UUID
    REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID
    REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  role VARCHAR(10) DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'member')),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID
    REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID
    REFERENCES users(id) ON DELETE SET NULL,
  content_type VARCHAR(20) NOT NULL
    CHECK (content_type IN ('text', 'voice', 'video', 'image', 'file')),
  content TEXT,
  media_hash TEXT,
  media_metadata JSONB,
  reply_to UUID REFERENCES messages(id),
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_conversation_created
  ON messages(conversation_id, created_at);

CREATE TABLE message_reads (
  message_id UUID
    REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID
    REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

CREATE TABLE files (
  content_hash TEXT PRIMARY KEY,
  mime_type TEXT,
  size BIGINT,
  original_name TEXT,
  uploader_id UUID
    REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID
    REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(10) NOT NULL
    CHECK (platform IN ('ios', 'android', 'web')),
  push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);