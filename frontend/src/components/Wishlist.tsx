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
        const token = await getAccessTokenSilently();
        const res = await axios.get(`http://localhost:5000/api/users/${user.sub}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedAuth0Id = res.data.data?.auth0Id || res.data.data?.user_id;
        if (fetchedAuth0Id) setAuth0Id(fetchedAuth0Id);
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
      const wishlistItems = res.data.data?.products || [];
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
      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error removing wishlist item:", error.response?.data || error.message);
    }
  };

  return (
    <div className=" mx-auto pl-[4rem]  bg-gray-900 min-h-screen pt-10">
      <h2 className="text-3xl font-bold text-center text-white mb-6">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="w-full text-center bg-gray-900 min-h-screen pt-10 text-gray-400 text-lg">Your wishlist is empty.</p>      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full text-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </a><br></br> <br></br>
              <h3 className="text-lg font-semibold text-white text-center">{item.name}</h3>
              <p className="text-yellow-400 text-lg font-bold">₹{item.price}</p>
              <p className="text-gray-400 text-sm text-center">{item.description}</p>
              <p className="text-gray-300 mt-2">Category: {item.category}</p>
              <p className="text-gray-300">Brand: {item.brand}</p>
              <p className="text-yellow-500 text-sm font-semibold">⭐ {item.rating} Ratings</p>
              <p className="text-gray-400">
                  URL:{" "}
                  <a
                    href={item.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-yellow-400"
                  >
                    Link
                  </a>
                </p>
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition-all w-full"
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