import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Wishlist = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [auth0Id, setAuth0Id] = useState("");
  useEffect(() => {
    const fetchUserId = async () => {
      if (!isAuthenticated || !user) return;

      try {
        // console.log("Fetching user ID:");
        // console.log("Auth0 User Object:", user); 

        const token = await getAccessTokenSilently();
        const res = await axios.get(`http://localhost:5000/api/users/${user.sub}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("data:", res.data);
        // console.log("data[0]:", res.data.data);
        const fetchedAuth0Id = res.data.data?.auth0Id || res.data.data?.user_id;

        if (fetchedAuth0Id) {
          // console.log("User ID fetched:", fetchedAuth0Id);
          setAuth0Id(fetchedAuth0Id);
        } else {
          console.error("auth0Id is missing in response");
        }
      } catch (err) {
        console.error("Error fetching userId:", err.response?.data || err.message);
      }
    };

    fetchUserId();
  }, [user, isAuthenticated, getAccessTokenSilently]);

  const fetchWishlist = useCallback(async () => {
    if (!auth0Id) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get(
        `http://localhost:5000/api/wishlist/user/${auth0Id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log(" wishlist:", res.data);
      // console.log("Products",res.data.data.products)
      // console.log("Products[0]",res.data.data.products[0])
      // console.log("wishlist b4",wishlist)
      const wishlistItems = res.data.data?.products || [];
      // console.log("wishlist after adding",wishlist)
      setWishlist(wishlistItems);
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    } catch (err) {
      console.error("Error fetching wishlist:", err.response?.data || err.message);
    }
  }, [auth0Id, getAccessTokenSilently]);
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const removeFromWishlist = async (id: string) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(
        `http://localhost:5000/api/wishlist/${auth0Id}/${id}`,  
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // console.log(`Deleted item ${id}, fetching updated wishlist...`);
  
      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error removing wishlist item:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="container mx-auto p-6 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-white mb-6">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col items-center transform hover:scale-105 transition-transform"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg border border-gray-700 mb-3"
              />
              <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              <p className="text-yellow-400 text-lg font-bold">₹{item.price}</p>
              <p className="text-gray-400 text-sm">{item.description}</p>
              <p className="text-gray-300 mt-2">Category: {item.category}</p>
              <p className="text-gray-300">Brand: {item.brand}</p>
              <p className="text-yellow-500 text-sm font-semibold">⭐ {item.rating} Ratings</p>

              <button
                onClick={() => removeFromWishlist(item._id)}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all w-full"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;