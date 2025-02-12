import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Products from "./components/Products";
import Home from "./components/Home";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
  
      <div className="flex">
        <Sidebar />
        <Header />
        <div className="ml-16 w-full p-4"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
   
  );
};

export default App;
