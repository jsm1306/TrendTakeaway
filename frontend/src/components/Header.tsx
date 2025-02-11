// import React, { useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { RiLogoutBoxLine } from "react-icons/ri";

// const Header = () => {
//   const { user, isAuthenticated, logout } = useAuth0();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   return (
//     <div className="header">
//       {isAuthenticated && user && (
//         <div className="relative">
//           {/* Profile Image */}
//           <img
//             src={user.picture}
//             alt="Profile"
//             className="profile-image cursor-pointer"
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             onError={(e) => {
//               console.log("Image load failed:", user.picture);
//               e.currentTarget.src = "/default-profile.png";
//             }}
//           />

//           {/* Dropdown Menu */}
//           {isDropdownOpen && (
//             <div className="dropdown-menu">
//               <p className="profile-name">{user.name}</p>
//               <button
//                 onClick={() => logout({ returnTo: window.location.origin })}
//                 className="logout-btn"
//               >
//                 <RiLogoutBoxLine size={20} /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Header;
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
                onClick={() => logout({ returnTo: window.location.origin })}
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
