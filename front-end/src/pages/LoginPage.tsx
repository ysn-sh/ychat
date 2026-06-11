import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import EmailInput from "@/components/auth/register/EmailInput";
import { useAuth } from "@/hooks/useAuth";
import "@/style/LoginPage.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailError = email && !email.includes("@") ? "Enter a valid email address" : "";

  const handleLogin = async () => {
    if (!email || !password || emailError) return;
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate("/chat"); // or wherever you want to redirect
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      buttonText={loading ? "Logging in..." : "Login"}
      onButtonClick={handleLogin}
      footerText="Don't have an Account yet?"
      footerLinkText="Register Here"
      footerLinkHref="/register"
      wrapperClassName="login-wrapper"
      containerClassName="login-container"
      buttonClassName="login-button"
      showOAuth
    >
      <EmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
      />
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={password.length > 0 && password.length < 6 ? "Password must be at least 6 characters" : ""}
      />
      {error && <div className="error-message">{error}</div>}
    </AuthLayout>
  );
}