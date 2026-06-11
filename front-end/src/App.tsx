import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { ChatPage } from "@/pages/ChatPage";
import { RegisterPage } from './pages/RegisterPage';
import { AuthProvider, AuthContext } from "@/context/AuthContext";
import { useContext } from 'react';

// Simple protected route: if not authenticated, redirect to /login
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/chat/*"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppLayout>
    </AuthProvider>
  );
}

export default App;