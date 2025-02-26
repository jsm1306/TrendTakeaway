import React, { useEffect, useState } from "react";

const Compare: React.FC = () => {
  const [compareProducts, setCompareProducts] = useState<any[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("compareProducts");
    if (storedProducts) {
      setCompareProducts(JSON.parse(storedProducts));
    }
  }, []);

  return (
    <div className=" mx-auto p-10 pr-10">
      <h1 className="text-2xl font-bold text-center mb-6">Product Comparison</h1>

      {compareProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products selected for comparison.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-black-200">
                <th className="border p-2">Image</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Ratings</th>
              </tr>
            </thead>
            <tbody>
              {compareProducts.map((product) => (
                <tr key={product._id} className="text-center">
                  <td className="border p-2">
                    <img src={product.image} className="w-20 h-20 object-cover mx-auto" />
                  </td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2 font-bold">₹{product.price}</td>
                  <td className="border p-2 text-yellow-500">{product.ratings}⭐</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-4">
        <button onClick={() => window.history.back()} className="bg-gray-500 text-white px-4 py-2 rounded">
          Back
        </button>
      </div>
    </div>
  );
};

export default Compare;
