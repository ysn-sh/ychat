import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import UsernameInput from "@/components/auth/UsernameInput";
import EmailInput from "@/components/auth/register/EmailInput";
import ConfirmPasswordInput from "@/components/auth/register/ConfirmPasswordInput";
import { useAuth } from "@/hooks/useAuth";
import "@/style/RegisterPage.css";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const usernameError = username && username.length < 3 ? "Username must be at least 3 characters" : "";
  const emailError = email && !email.includes("@") ? "Enter a valid email address" : "";
  const passwordError = password && password.length < 8 ? "Password must be at least 8 characters" : "";
  const confirmError = confirmPassword && password !== confirmPassword ? "Passwords do not match" : "";

  const canSubmit = username && email && password && confirmPassword &&
    !usernameError && !emailError && !passwordError && !confirmError;

  const handleRegister = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      setError(null);
      await register(username, email, password);
      navigate("/chat"); // redirect after successful registration
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      buttonText={loading ? "Creating account..." : "Register"}
      onButtonClick={handleRegister}
      footerText="Already have an account?"
      footerLinkText="Login Here"
      footerLinkHref="/login"
      wrapperClassName="register-wrapper"
      containerClassName="register-container"
      buttonClassName="register-button"
      showOAuth
    >
      <UsernameInput
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={usernameError}
      />
      <EmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
      />
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError}
      />
      <ConfirmPasswordInput
        password={password}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmError}
      />
      {error && <div className="error-message">{error}</div>}
    </AuthLayout>
  );
};