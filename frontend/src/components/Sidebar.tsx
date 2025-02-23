import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline, IoChatbubbleOutline } from "react-icons/io5";
import { BsBoxSeam, BsCalendar } from "react-icons/bs";
import { FiSettings, FiShoppingCart } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  const location = useLocation(); 
  useEffect(() => {
    setIsCollapsed(true);
    localStorage.setItem("sidebarCollapsed", "true"); 
  }, [location.pathname]); 

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-800 dark:bg-gray-900 shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => {
          setIsCollapsed(!isCollapsed);
          localStorage.setItem("sidebarCollapsed", JSON.stringify(!isCollapsed));
        }}
      >
        <FaBars size={24} className="text-gray-400" />
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            TrendTakeaway 🛒
          </h1>
        )}
      </div>
      <div className="mt-6 space-y-4">
        {[
          { to: "/", icon: <IoHomeOutline size={20} />, text: "Dashboard" },
          { to: "/products", icon: <BsBoxSeam size={20} />, text: "Products" },
          { to: "/messages", icon: <IoChatbubbleOutline size={20} />, text: "Messages" },
          { to: "/calendar", icon: <BsCalendar size={20} />, text: "Calendar" },
          { to: "/settings", icon: <FiSettings size={20} />, text: "Settings" },
          { to: "/wishlist", icon: <FiShoppingCart size={20} />, text: "WishList" },
        ].map(({ to, icon, text }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === to ? "bg-blue-500 text-white" : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            {icon}
            {!isCollapsed && <span className="transition-opacity duration-300">{text}</span>}
          </Link> ))}
      </div>
    </div>
  );
};

export default Sidebar;
