import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const MyComponent: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [message, setMessage] = useState<string>("");

  const fetchData = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("http://localhost:5000/api/protected-route", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message); 
    } catch (error) {
      console.error("Error fetching protected data:", error);
      setMessage("Failed to fetch data.");
    }
  };

  return (
    <div>
      <button style={{ color: "black" }} onClick={fetchData}>
        Fetch Protected Data
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MyComponent;
