import React from "react";
import "./Home.css"; // Assuming you have a CSS file for styling
import image from "../assets/image.jpg"; // Correct path to the image

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="title">welcome to TrendTakeaway!</h1>
      <div className="content">
        <p className="description">
          Zoho Commerce contains all the tools you need to build a website, accept orders, track inventory, process payments, manage shipping, market your brand, and analyze your data.
        </p>
        <img src={image} alt="Business Promo" className="promo-image" />
      </div>
    </div>
  );
};

export default Home;
