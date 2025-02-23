import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react"; 

const Products: React.FC = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products", { headers: { "Accept": "application/json" } })
      .then(response => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          setError("Invalid data format received");
        }
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      });
    const fetchWishlist = async () => {
      if (!user?.sub) return; 
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`http://localhost:5000/api/wishlist/user/${user.sub}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.data.products) {
          setWishlist(res.data.data.products.map((item: any) => item._id)); 
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, user?.sub]);
//need to check toggle
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
          
            await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
                data: requestData 
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
    if (selectedProducts.find(p => p._id === product._id)) {
      setSelectedProducts(selectedProducts.filter(p => p._id !== product._id));
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Products</h1>
      <div className="text-center mb-4">
        <p className="text-lg font-semibold">Selected for Comparison: {selectedProducts.length} / 4</p>
        {selectedProducts.length > 1 && (
          <button
            onClick={navigateToCompare}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Compare Now
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
            <img src={product.image} className="w-full h-40 object-cover" />
            <div className="p-2 text-center">
              <h2 className="text-lg font-semibold text-black">{product.name}</h2>
              <p className="text-gray-700">Price: <span className="font-bold">₹{product.price}</span></p>
              <p className="text-yellow-500">Ratings: {product.ratings}⭐</p>
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`mt-2 px-4 py-2 rounded-md ${
                  wishlist.includes(product._id) ? "bg-pink-500 text-white" : "bg-gray-200 text-black"
                } transition-all duration-200`}>
                {wishlist.includes(product._id) ? "💖 Wishlisted" : "🤍 Add to Wishlist"}
              </button>
              <button
                onClick={() => handleCompare(product)}
                className={`mt-2 px-4 py-2 rounded ${selectedProducts.find(p => p._id === product._id) ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                {selectedProducts.find(p => p._id === product._id) ? "Remove" : "Compare"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
