import React from 'react';
import './OAuthButton.css';

interface OAuthButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  text,
  href,
  onClick,
  icon,
  className = '',
}) => {
  if (href) {
    return (
      <a
        href={href}
        className={`oauth-button ${className}`}
        role="button"
      >
        <span className="oauth-button__text">{text}</span>
        {icon && <span className="oauth-button__icon">{icon}</span>}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`oauth-button ${className}`}
      type="button"
    >
      {icon && <span className="oauth-button__icon">{icon}</span>}
      <span className="oauth-button__text">{text}</span>
    </button>
  );
};