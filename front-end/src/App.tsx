import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import { AppLayout } from "./layouts/AppLayout";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { ChatPage } from "@/pages/ChatPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute() {
  const { status } = useAuth();

  if (status === "loading") {
    return null;
  }
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function GuestRoute() {
  const { status } = useAuth();

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated") {
    return <Navigate to="/chat" replace />;
  }
  return <Outlet />;
}

function App() {
  return ( 
  <AppLayout> 
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/chat/*" element={<ChatPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  </AppLayout>
  );
}

export default App;