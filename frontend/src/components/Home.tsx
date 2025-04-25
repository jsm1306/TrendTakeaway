import "./Home.css";
import Header from "./Header";
import { TypewriterEffect } from "./ui/typewriter-effect";
import LampDemo from "./ui/lamp";
import { Timeline } from "./ui/timeline";
import { useState, useEffect } from "react";
import { Carousel, Card } from "./ui/apple-cards-carousel";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const words = [
    { text: "Welcome ", className: "text-white" },
    { text: "to ", className: "text-white" },
    { text: "TrendTakeaway", className: "text-blue-500" },
  ];

  const [items, setItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();
        // Map products to Card components for apple card carousel
        const cards = products
          .slice(0, 5)
          .map((product: any, index: number) => (
            <Card
              key={index}
              index={index}
              card={{
                src: product.image,
                title: product.name,
                category: product.category,
                content: <p>Price: ${product.price}</p>,
              }}
            />
          ));
        setItems(cards);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const timelineData = [
    {
      title: "Interactive User Reviews & Discussion Forum",
      content: (
        <>
          Instead of plain reviews, allow polls, upvoting helpful reviews, and
          community Q&A for doubts.
        </>
      ),
    },
    {
      title: "User Stories & Testimonials",
      content: (
        <>
          Let real users share their experiences and mistakes when buying
          products.
        </>
      ),
    },
    {
      title: 'AI-Powered "Best Product for You" Quiz',
      content: (
        <>
          Ask simple questions to provide top 3 product recommendations based on
          user answers.
        </>
      ),
    },
    {
      title: "Save & Share Comparison Results",
      content: (
        <>
          Allow users to save their favorite comparisons and generate sharable
          links.
        </>
      ),
    },
    {
      title: "Video Reviews & Demo Integration",
      content: (
        <>
          Show YouTube embedded video reviews and short GIFs showing products in
          action.
        </>
      ),
    },
    {
      title: "Customizable Wishlist & Save for Later",
      content: (
        <>
          Users can save and compare their favorite products and share their
          wishlist with friends.
        </>
      ),
    },
    {
      title: "Category-Specific Shopping Guides",
      content: (
        <>
          Show beginner-friendly guides based on categories like budget laptops
          for students.
        </>
      ),
    },
    {
      title: "Bundle & Save Product Recommendations",
      content: (
        <>
          Suggest related products that go well together, like a cooling pad
          with a laptop.
        </>
      ),
    },
    {
      title: "History-Based Smart Recommendations",
      content: (
        <>Show previously viewed categories and suggest similar products.</>
      ),
    },
    {
      title: "What’s in the Box? Unboxing Preview",
      content: (
        <>
          Show a simple visual breakdown of what accessories come with a
          product.
        </>
      ),
    },
    {
      title: "Community Voting for Best Products",
      content: (
        <>
          Let users vote for the best product in each category and display live
          vote counts.
        </>
      ),
    },
  ];

  return (
    <div className="home-layout ">
      <Header />
      <div className="home-container">
        <div className="hero">
          {/* <Boxes /> */}
          <TypewriterEffect words={words} />
        </div>

        <div className="lamp">
          <LampDemo />
        </div>
        {items.length > 0 && <Carousel items={items} />}

        <Timeline data={timelineData} />
      </div>
    </div>
  );
};

export default Home;
