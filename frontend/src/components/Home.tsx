import React from "react";
import "./Home.css"; // Assuming you have a CSS file for styling
import image from "../assets/image.jpg"; // Correct path to the image

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="title">Welcome to TrendTakeaway!</h1>
      <div className="content">
        <p className="description">
        Amazon: Implement a "Product Comparison" tool to help users compare similar products based on specifications and reviews.
        </p>
        <img src={image} alt="Business Promo" className="promo-image" />
      </div>
    </div>
  );
};

export default Home;
