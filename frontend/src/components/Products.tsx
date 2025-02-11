import React, { useEffect, useState } from "react";
import axios from "axios";

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products", { headers: { "Accept": "application/json" } })
    .then(response => {
        console.log("Received Data:", response.data); 
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
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            <img src={product.image} alt={product.name} width="100" />
            <p>{product.name}</p>
            <p>Price: ₹{product.price}</p>
            <p>Ratings: {product.ratings}⭐</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
