import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Products from "./components/Products";
import Home from "./components/Home";
import Header from "./components/Header";
import Compare from "./components/Compare";
import Wishlist from "./components/Wishlist";

const App: React.FC = () => {
  return (
  
      <div className="flex">
        
        <Header />
        <div className="ml-16 w-full p-4"> 
        <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path = "/compare"element={<Compare />} />
            <Route path= "/wishlist" element={<Wishlist/>} />
          </Routes>
        </div>
      </div>
   
  );
};

export default App;
