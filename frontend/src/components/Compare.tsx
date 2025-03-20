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
    <div className="mx-auto p-10" style={{ marginLeft: '40px' }}>
      <h1 className="text-2xl font-bold text-center mb-6">Product Comparison</h1>

      {compareProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products selected for comparison.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-black-200">
                <th className="border p-2">Description</th>
                {compareProducts.map((product) => (
                  <th key={product._id} className="border p-2">
                    <img src={product.image} className="w-20 h-20 object-cover mx-auto" alt={product.name} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 text-center font-bold">Name</td>
                {compareProducts.map((product) => (
                  <td key={product._id} className="border p-2 text-center">
                    {product.name}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-2 text-center font-bold">Price</td>
                {compareProducts.map((product) => (
                  <td key={product._id} className="border p-2 text-center">
                    ₹{product.price}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-2 text-center font-bold">Ratings</td>
                {compareProducts.map((product) => (
                  <td key={product._id} className="border p-2 text-center text-yellow-500">
                    {product.ratings}⭐
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-2 text-center font-bold">Actions</td>
                {compareProducts.map((product) => (
                  <td key={product._id} className="border p-2 text-center">
                    <button
                      onClick={() => {
                        const updatedProducts = compareProducts.filter((p) => p._id !== product._id);
                        setCompareProducts(updatedProducts);
                        localStorage.setItem("compareProducts", JSON.stringify(updatedProducts));
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Remove
                    </button>
                  </td>
                ))}
              </tr>
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