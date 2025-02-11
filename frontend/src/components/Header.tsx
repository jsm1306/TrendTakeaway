import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Header.css";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="header">
      {isAuthenticated ? (
        <div className="profile-section">
          <img
            src={user?.picture || "/default-profile.png"}
            alt="Profile"
            className="profile-image"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p className="profile-name">{user?.name}</p>
              <button
                className="logout-btn"
                onClick={() => {
                  setDropdownOpen(false);
                  logout({ returnTo: window.location.origin });
                }}
              >
                <RiLogoutBoxLine size={20} />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="login-btn" onClick={() => loginWithRedirect()}>
          <FaUserCircle size={20} /> Login
        </button>
      )}
    </div>
  );
};

export default Header;
