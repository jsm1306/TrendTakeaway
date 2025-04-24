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
    <div className="max-w-7xl mx-auto p-6 text-gray-100">
      <h1 className="text-3xl font-extrabold text-center mb-10 text-white drop-shadow">
        🛒 Product Comparison
      </h1>

      {compareProducts.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No products selected for comparison.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-inner bg-[#1f1f1f]">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-[#2b2b2b] text-gray-200">
                <th className="border border-gray-700 p-4 text-left text-lg">
                  Details
                </th>
                {compareProducts.map((product) => (
                  <th key={product._id} className="border border-gray-700 p-4">
                    <img
                      src={product.image}
                      className="h-36 w-36 object-contain mx-auto rounded-md shadow-lg"
                      alt={product.name}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { label: "Name", key: "name" },
                { label: "Price", key: "price", prefix: "₹" },
                {
                  label: "Brand",
                  key: "brand",
                  style: "text-blue-400 font-medium",
                },
                {
                  label: "Ratings",
                  key: "ratings",
                  suffix: "⭐",
                  style: "text-yellow-400 font-medium",
                },
              ].map((row) => (
                <tr
                  key={row.label}
                  className="odd:bg-[#1a1a1a] even:bg-[#242424]"
                >
                  <td className="border border-gray-700 p-4 font-semibold text-left text-white">
                    {row.label}
                  </td>
                  {compareProducts.map((product) => (
                    <td
                      key={product._id}
                      className={`border border-gray-700 p-4 text-center ${
                        row.style || "text-gray-200"
                      }`}
                    >
                      {row.prefix || ""}
                      {product[row.key]}
                      {row.suffix || ""}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="odd:bg-[#1a1a1a] even:bg-[#242424]">
                <td className="border border-gray-700 p-4 font-semibold text-left text-white">
                  Specifications
                </td>
                {compareProducts.map((product) => (
                  <td
                    key={product._id}
                    className="border border-gray-700 p-4 text-left text-sm text-gray-300"
                  >
                    {product.specifications
                      .split(",")
                      .map((spec: string, index: number) => (
                        <div key={index} className="mb-1">
                          • {spec.trim()}
                        </div>
                      ))}
                  </td>
                ))}
              </tr>

              <tr className="odd:bg-[#1a1a1a] even:bg-[#242424]">
                <td className="border border-gray-700 p-4 font-semibold text-left text-white">
                  Actions
                </td>
                {compareProducts.map((product) => (
                  <td
                    key={product._id}
                    className="border border-gray-700 p-4 text-center"
                  >
                    <button
                      onClick={() => {
                        const updatedProducts = compareProducts.filter(
                          (p) => p._id !== product._id
                        );
                        setCompareProducts(updatedProducts);
                        localStorage.setItem(
                          "compareProducts",
                          JSON.stringify(updatedProducts)
                        );
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 shadow-md"
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

      <div className="text-center mt-10">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-lg transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default Compare;
