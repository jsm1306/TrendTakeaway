import React from "react";
import "./Home.css";
import image from "../assets/image.jpg";
import Sidebar from "./Sidebar";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./Header";

const Home = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div className="home-layout">
      <Header />
      <div className="home-container">
        <h2 className="typing-title">Welcome to TrendTakeaway!</h2>
        <div className="content">
          <p className="description">
            Amazon: Implement a "Product Comparison" tool to help users compare
            similar products based on specifications and reviews.
          </p>
          <img src={image} alt="Business Promo" className="promo-image" />
        </div>
      </div>
    </div>
  );
};

export default Home;
