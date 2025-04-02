import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Products from "./components/Products";
import Home from "./components/Home";
import Header from "./components/Header";
import Compare from "./components/Compare";
import Wishlist from "./components/Wishlist";
import DiscussionPage from "./pages/DiscussionPage";

const App: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/discussions" element={<DiscussionPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
