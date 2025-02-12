import React, { useEffect, useState } from "react";
import axios from "axios";

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products", { headers: { "Accept": "application/json" } })
    .then(response => {
        // console.log("Received Data:", response.data); 
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

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
            <img src={product.image}  className="w-full h-40 object-cover" />
            <div className="p-2 text-center">
              <h2 className="text-lg font-semibold text-black">{product.name}</h2>
              <p className="text-gray-700">Price: <span className="font-bold">₹{product.price}</span></p>
              <p className="text-yellow-500">Ratings: {product.ratings}⭐</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
