// layouts/AppLayout.tsx
import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <div
      className="app-layout flex items-center"
      style={{
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        padding: isChatPage ? "0" : "var(--spacing-l)",
      }}
    >
      {!isChatPage && <TopNav />}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden", width:"100%", justifyContent:"center" }}>{children}</div>
      {!isChatPage && <Footer />}
    </div>
  );
}