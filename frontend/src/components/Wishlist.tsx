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
          console.log("User ID fetched:", fetchedAuth0Id);
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
    <div>
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlist.map((item) => (
            <li key={item._id}>
              {item.name} - ${item.price}
              <img src={item.image} alt={item.name} style={{ width: "100px", height: "100px" }} />
              <p>{item.description}</p>
              <p>{item.category}</p>
              <p>{item.brand}</p>
              <p>{item.rating}</p>
              <button
                onClick={() => removeFromWishlist(item._id)}
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#cc0000")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff4d4d")}
              > Remove from Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
