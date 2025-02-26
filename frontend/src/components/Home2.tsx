import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import axios from "axios";
import "./Home.css";
import Header from "./Header";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products") // Adjust the API endpoint as needed
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [products]);
  return (
    <div className="home-layout pl-10">
      <Header />
      <div className="home-container pr-20">
        <h2 className="typing-title">Welcome to TrendTakeaway!</h2>
        <div className="relative w-full  h-96 overflow-hidden">
          {products.length > 0 && (
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {products.map((product, index) => (
                <div key={index} className=" flex-shrink-0">
                  <Card>
                    <CardContent className="flex items-center justify-center w-full h-96">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>       
        <div className="section black">
          <h3>Interactive User Reviews & Discussion Forum</h3>
          <p>
            Instead of plain reviews, allow polls, upvoting helpful reviews, and community Q&A for doubts.
          </p>
        </div>

        <div className="section white">
          <h3>User Stories & Testimonials</h3>
          <p>
            Let real users share their experiences and mistakes when buying products.
          </p>
        </div>

        <div className="section black">
          <h3>AI-Powered "Best Product for You" Quiz</h3>
          <p>
            Ask simple questions to provide top 3 product recommendations based on user answers.
          </p>
        </div>

        <div className="section white">
          <h3>Save & Share Comparison Results</h3>
          <p>
            Allow users to save their favorite comparisons and generate sharable links.
          </p>
        </div>

        <div className="section black">
          <h3>Video Reviews & Demo Integration</h3>
          <p>
            Show YouTube embedded video reviews and short GIFs showing products in action.
          </p>
        </div>

        <div className="section white">
          <h3>Customizable Wishlist & Save for Later</h3>
          <p>
            Users can save and compare their favorite products and share their wishlist with friends.
          </p>
        </div>

        <div className="section black">
          <h3>Category-Specific Shopping Guides</h3>
          <p>
            Show beginner-friendly guides based on categories like budget laptops for students.
          </p>
        </div>

        <div className="section white">
          <h3>Bundle & Save Product Recommendations</h3>
          <p>
            Suggest related products that go well together, like a cooling pad with a laptop.
          </p>
        </div>

        <div className="section black">
          <h3>History-Based Smart Recommendations</h3>
          <p>
            Show previously viewed categories and suggest similar products.
          </p>
        </div>

        <div className="section white">
          <h3>What’s in the Box? Unboxing Preview</h3>
          <p>
            Show a simple visual breakdown of what accessories come with a product.
          </p>
        </div>

        <div className="section black">
          <h3>Community Voting for Best Products</h3>
          <p>
            Let users vote for the best product in each category and display live vote counts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;