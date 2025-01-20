import { Button } from './ui/button.tsx';
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { BsPlusSquareFill } from "react-icons/bs";

const Navbar = () => {
  const [isLightMode, setIsLightMode] = useState(true); // Custom light/dark mode toggle

  const toggleColorMode = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle("dark"); // Adds "dark" to the HTML class
  };

  return (
    <div className={`w-full fixed top-0 px-4 ${isLightMode ? "bg-gray-100" : "bg-gray-900"} shadow-md`}>
      <div className="flex items-center justify-between h-16 max-w-[1700px] mx-auto">
        {/* Left Section - Logo */}
        <div>
          <Link to="/">
            <h1 className="text-center text-2xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Trend Takeaway 🛒
            </h1>
          </Link>
        </div>

        {/* Right Section - Buttons */}
        <div className="flex items-center gap-4">
          {/* Create Button */}
          <Link to="/create">
            <Button variant="default" className="p-2 mr-4"> {/* Adjusted spacing */}
              <BsPlusSquareFill size={20} />
            </Button>
          </Link>

          {/* Dark Mode Toggle */}
          <Button variant="outline" onClick={toggleColorMode} className="p-2">
            {isLightMode ? <IoMoon size={20} /> : <LuSun size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
