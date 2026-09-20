interface Env {
  VITE_WS_URL: string;
}

export const env: Env = {
  VITE_WS_URL: import.meta.env.VITE_WS_URL || "ws://localhost:4000",
};