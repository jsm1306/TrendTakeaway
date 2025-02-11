import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoHomeOutline, IoChatbubbleOutline } from "react-icons/io5";
import { BsBoxSeam, BsCalendar } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaBars } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div
      className={`sidebar ${
        isCollapsed ? "w-16" : "w-64"
      } bg-gray-800 dark:bg-gray-800 h-screen fixed top-0 left-0 shadow-md transition-all duration-300`}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FaBars size={24} className="text-gray-400" />
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            TrendTakeaway 🛒
          </h1>
        )}
      </div>

      <div className="flex flex-col space-y-4 mt-6">
        <Link to="/" className="flex items-center gap-4 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
          <IoHomeOutline size={20} />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        <Link to="/products" className="flex items-center gap-4 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
          <BsBoxSeam size={20} />
          {!isCollapsed && <span>Products</span>}
        </Link>
        <Link to="/messages" className="flex items-center gap-4 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
          <IoChatbubbleOutline size={20} />
          {!isCollapsed && <span>Messages</span>}
        </Link>
        <Link to="/calendar" className="flex items-center gap-4 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
          <BsCalendar size={20} />
          {!isCollapsed && <span>Calendar</span>}
        </Link>
        <Link to="/settings" className="flex items-center gap-4 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
          <FiSettings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>  

      
    </div>
  );
};

export default Sidebar;
