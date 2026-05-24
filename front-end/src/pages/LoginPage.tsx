import { AuthLayout } from "@/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import UsernameInput from "@/components/auth/UsernameInput";
import "@/style/LoginPage.css";

export function LoginPage() {
  const handleLogin = () => {
    console.log("Login clicked");
  };

  return (
    <AuthLayout
      buttonText="Login"
      onButtonClick={handleLogin}
      footerText="Don't have an Account yet?"
      footerLinkText="Register Here"
      footerLinkHref="/register"
      wrapperClassName="login-wrapper"
      containerClassName="login-container"
      buttonClassName="login-button"
      showOAuth
    >
      <UsernameInput />
      <PasswordInput />
    </AuthLayout>
  );
}