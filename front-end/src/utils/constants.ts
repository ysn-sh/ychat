/** -------------------------
 * API & Environment
 * ------------------------- */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000"
export const AUTH_API_PATHS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH_TOKEN: "/auth/refresh",
}
export const CHAT_API_PATHS = {
  GET_CONVERSATIONS: "/conversations",
  GET_MESSAGES: (conversationId: string) => `/conversations/${conversationId}/messages`,
  SEND_MESSAGE: (conversationId: string) => `/conversations/${conversationId}/messages`,
  UPLOAD_FILE: (conversationId: string) => `/conversations/${conversationId}/files`,
}

/** -------------------------
 * WebSocket Events
 * ------------------------- */
export const WS_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  MESSAGE_SEND: "message:send",
  MESSAGE_RECEIVE: "message:receive",
  MESSAGE_EDIT: "message:edit",
  MESSAGE_DELETE: "message:delete",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
} as const

/** -------------------------
 * Message Types
 * ------------------------- */
export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
  SYSTEM: "system",
} as const

export const MESSAGE_STATUS = {
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
} as const

/** -------------------------
 * Local Storage Keys
 * ------------------------- */
export const LOCAL_STORAGE_KEYS = {
  TOKEN: "chat_token",
  SETTINGS: "chat_settings",
  LAST_OPENED_CONVERSATION: "last_opened_conversation",
} as const

/** -------------------------
 * Limits
 * ------------------------- */
export const LIMITS = {
  MESSAGE_MAX_LENGTH: 2000,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 50,
  CONVERSATIONS_PAGE_SIZE: 50,
  MESSAGES_PAGE_SIZE: 50,
}

/** -------------------------
 * UI / Default Values
 * ------------------------- */
export const DEFAULT_AVATAR_URL = "/assets/default-avatar.png"
export const TYPING_INDICATOR_TEXT = "is typing..."
export const DATE_SEPARATOR_FORMAT = {
  TODAY: "Today",
  YESTERDAY: "Yesterday",
}

export const CHAT_THEME = {
  // Colors
  TEXT: "hsla(0, 0%, 90%, 1)",
  TEXT_MUTED: "hsla(0, 0%, 60%, 1)",
  BG_LIGHT: "hsla(0, 0%, 20%, 1)",
  BG: "hsla(0, 0%, 15%, 1)",
  BG_DARK: "hsla(0, 0%, 10%, 1)",
  ACCENT: "hsla(170, 66%, 46%, 1)",

  // Spacing
  SPACING_XS: "0.25rem",
  SPACING_S: "0.5rem",
  SPACING_M: "1rem",
  SPACING_L: "1.5rem",
  SPACING_XL: "2rem",
  SPACING_XXL: "3rem",

  BORDER_RADIUS: "0.5rem",
  INPUT_HEIGHT: "2.5rem",
  MESSAGE_BUBBLE_RADIUS: "0.75rem",
}