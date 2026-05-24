import { type ReactNode } from "react";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { FcGoogle } from "react-icons/fc";
import "./AuthLayout.css";

interface AuthLayoutProps {
  children: ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  showOAuth?: boolean;
  wrapperClassName?: string;
  containerClassName?: string;
  buttonClassName?: string;
}

export function AuthLayout({
  children,
  buttonText,
  onButtonClick,
  footerText,
  footerLinkText,
  footerLinkHref,
  showOAuth = true,
  wrapperClassName = "auth-wrapper",
  containerClassName = "auth-container",
  buttonClassName = "auth-button",
}: AuthLayoutProps) {
  return (
    <div className={wrapperClassName}>
      <div className={containerClassName}>
        {children}
        <button className={buttonClassName} onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>

      {showOAuth && (
        <>
          <hr style={{ width: "80%" }} />
          <div className="auth-alt-action">
            <OAuthButton
              text="Continue with Google"
              href="#"
              icon={<FcGoogle size="20px" />}
            />
            <div style={{ width: "2px", padding: 0, margin: 0 }}>|</div>
            <p style={{ fontSize: "16px", color: "var(--text-muted)" }}>
              {footerText}
              <a href={footerLinkHref} className="auth-link">
                {footerLinkText}
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
}