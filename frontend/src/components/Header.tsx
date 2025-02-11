import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div className="header">
      {isAuthenticated && user && (
        <div className="profile-section">
          <p className="profile-name">{user.name}</p>
          <img
            src={user.picture}
            alt="Profile"
            className="profile-image"
            onError={(e) => {
              console.log("Image load failed:", user.picture);
              e.currentTarget.src = "/default-profile.png";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
