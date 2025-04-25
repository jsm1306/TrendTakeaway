import { Routes, Route } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "./components/ui/sidebar"; // Adjust if your path differs
import { IoHomeOutline, IoChatbubbleOutline } from "react-icons/io5";
import { BsBoxSeam, BsCalendar } from "react-icons/bs";
import { FiSettings, FiShoppingCart } from "react-icons/fi";
import ProductDetails from "./components/ProductDetails";
import Products from "./components/Products";
import Home from "./components/Home";
import Header from "./components/Header";
import Compare from "./components/Compare";
import Wishlist from "./components/Wishlist";
import DiscussionPage from "./pages/DiscussionPage";

const navLinks = [
  { to: "/", icon: <IoHomeOutline size={20} />, text: "Dashboard" },
  { to: "/products", icon: <BsBoxSeam size={20} />, text: "Products" },
  {
    to: "/discussions",
    icon: <IoChatbubbleOutline size={20} />,
    text: "Discussions",
  },
  { to: "/calendar", icon: <BsCalendar size={20} />, text: "Calendar" },
  { to: "/settings", icon: <FiSettings size={20} />, text: "Settings" },
  {
    to: "/wishlist",
    icon: <FiShoppingCart size={20} />,
    text: "WishList",
  },
];
const App: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      <Sidebar>
        <SidebarBody className="h-full">
          {" "}
          <div className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <SidebarLink
                key={index}
                link={{
                  label: link.text,
                  href: link.to,
                  icon: link.icon,
                }}
              />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {" "}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/discussions" element={<DiscussionPage />} />
            <Route path="/calendar" element={<div>Calendar Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
