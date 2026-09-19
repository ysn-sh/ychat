import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { UserAvatar } from "@/components/chat/sidebar/UserAvatar"
import { Dropdown, DropdownItem } from "@/components/common/DropDownMenu"
import { ThemeToggle } from "@/components/common/ThemeToggle"

import "./TopNav.css"

export function TopNav() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="topnav">
      <Link to="/" className="logo">
        YCHAT
      </Link>

      <div className="topnav-actions">
        {!isAuthenticated ? (
          <Link to="/login">
            <button>Login</button>
          </Link>
        ) : (
          <Dropdown trigger={<UserAvatar user={user!} size={"lg"} />} align="right">
            <DropdownItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownItem>
            <DropdownItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownItem>
            <DropdownItem>
              <ThemeToggle />
            </DropdownItem>

            <div className="dropdown-divider" />

            <DropdownItem
              danger
              onClick={() => {
                logout()
                navigate("/")
              }}
            >
              Logout
            </DropdownItem>
          </Dropdown>
        )}
      </div>
    </nav>
  )
}