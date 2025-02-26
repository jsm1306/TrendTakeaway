import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {Badge} from "./ui/badge";
const Products: React.FC = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: { Accept: "application/json" },
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      }
    };

    const fetchWishlist = async () => {
      if (!user?.sub) return;

      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`http://localhost:5000/api/wishlist/user/${user.sub}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.data.products) {
          setWishlist([...new Set(res.data.data.products.map((item: any) => item._id))]);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchProducts();
    if (isAuthenticated) fetchWishlist();
  }, [isAuthenticated, user?.sub, getAccessTokenSilently]);

  const toggleWishlist = async (productId) => {
    if (!user?.sub) {
        alert("Please log in to add items to the wishlist.");
        return;
    }

    try {
        const token = await getAccessTokenSilently();
        const requestData = { auth0Id: user.sub, productId };

        let updatedWishlist;
        if (wishlist.includes(productId)) {
            await axios.delete(`http://localhost:5000/api/wishlist/${user.sub}/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            updatedWishlist = wishlist.filter(id => id !== productId);
        } else {
            await axios.post("http://localhost:5000/api/wishlist/add", requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updatedWishlist = [...wishlist, productId];
        }
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    } catch (error) {
        console.error("Error updating wishlist:", error.response?.data || error.message);
    }
};

  const handleCompare = (product: any) => {
    if (selectedProducts.some((p) => p._id === product._id)) {
      setSelectedProducts(selectedProducts.filter((p) => p._id !== product._id));
    } else {
      if (selectedProducts.length < 4) {
        setSelectedProducts([...selectedProducts, product]);
      } else {
        alert("You can compare up to 4 products only!");
      }
    }
  };

  const navigateToCompare = () => {
    if (selectedProducts.length < 2) {
      alert("Select at least 2 products to compare!");
      return;
    }
    localStorage.setItem("compareProducts", JSON.stringify(selectedProducts));
    window.location.href = "/compare";
  };

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  return (
    <div className="bg-gray-900 pl-16">
      <h1 className="text-3xl font-bold text-center text-white mb-6 pt-6">
        Products
      </h1>
      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-gray-300">
          Selected for Comparison: {selectedProducts.length} / 4
        </p>
        {selectedProducts.length > 1 && (
          <button
          onClick={navigateToCompare}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg mt-3 transition-all"
        >
          <Badge variant="default">Compare Now</Badge>
        </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pr-4"> {/* Adjusted padding */}
        {products
          .filter((product) => product._id)
          .map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 shadow-md rounded-lg overflow-hidden p-5 transition-transform hover:scale-105"
            >
              <img
                src={product.image}
                className="w-full h-40 object-cover rounded-lg"
                alt={product.name}
              />
              <div className="p-3 text-center">
                <h2 className="text-lg font-semibold text-white">
                  {product.name}
                </h2>
                
                <p className="text-gray-400">
                  Price:{" "}
                  <span className="font-bold text-yellow-400">
                    ₹{product.price}
                  </span>
                </p>
                <p className="text-yellow-500">⭐ {product.ratings} Ratings</p>
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`mt-3 px-4 py-2 w-full rounded-lg font-semibold ${
                    wishlist.includes(product._id)
                      ? "bg-pink-500 hover:bg-pink-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  } transition-all duration-300`}
                >
                  {wishlist.includes(product._id) ? (
                    <span style={{ color: 'pink' }}> Wishlisted</span>
                  ) : (
                    <span>  Add to Wishlist</span>
                  )}
                  
                </button>
                <button
                  onClick={() => handleCompare(product)}
                  className={`mt-3 px-4 py-2 w-full rounded-lg font-semibold ${
                    selectedProducts.some((p) => p._id === product._id)
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white transition-all duration-300`}
                >
                  {selectedProducts.some((p) => p._id === product._id)
                    ? " Remove"
                    : " Compare"}
                </button>               <br></br> <br></br>
                <p className="text-gray-400">
                  URL:{" "}
                  <a
                    href={product.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-yellow-400"
                  >
                    Link
                  </a>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Products;