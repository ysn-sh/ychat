import { useState } from "react";
import { AuthLayout } from "@/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import UsernameInput from "@/components/auth/UsernameInput";
import EmailInput from "@/components/auth/register/EmailInput";
import ConfirmPasswordInput from "@/components/auth/register/ConfirmPasswordInput";
import "@/style/RegisterPage.css";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const usernameError = username && username.length < 3 ? "Username must be at least 3 characters" : "";
  const emailError = email && !email.includes("@") ? "Enter a valid email address" : "";
  const passwordError = password && password.length < 6 ? "Password must be at least 6 characters" : "";
  const confirmError = confirmPassword && password !== confirmPassword ? "Passwords do not match" : "";

  const handleRegister = () => {
    if (usernameError || emailError || passwordError || confirmError) {
      alert("Please fix the errors above");
      return;
    }
    console.log("Registering with:", { username, email, password });
  };

  return (
    <AuthLayout
      buttonText="Register"
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
    </AuthLayout>
  );
};