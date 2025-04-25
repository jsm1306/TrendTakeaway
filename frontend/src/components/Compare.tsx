import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import html2canvas from "html2canvas";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";

const Compare: React.FC = () => {
  const [compareProducts, setCompareProducts] = useState<any[]>([]);
  const [categoryMismatch, setCategoryMismatch] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedProducts = localStorage.getItem("compareProducts");
    if (storedProducts) {
      const products = JSON.parse(storedProducts);
      setCompareProducts(products);

      const categories = products.map((p: any) => p.category);
      const allSameCategory = categories.every(
        (cat: any) => cat === categories[0]
      );
      setCategoryMismatch(!allSameCategory);
    }
  }, []);
  const COLORS = [
    "#8884d8", // light purple
    "#82ca9d", // green
    "#ffc658", // yellow
    "#ff7f50", // coral
    "#a28bf6", // lilac
    "#00c49f", // teal
    "#ff6b81", // pink
  ];

  const data = compareProducts.map((product, index) => ({
    name: `Product ${index + 1}`,
    price: product.price,
  }));
  interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md border border-gray-700">
          <p>₹{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const captureComparison = async () => {
    if (compareRef.current) {
      const canvas = await html2canvas(compareRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      setCapturedImage(imgData);
      setShowShareOptions(true);
    }
  };

  const shareOnTwitter = () => {
    if (!capturedImage) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this product comparison!");
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank"
    );
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = "comparison.png";
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-gray-100" ref={compareRef}>
      <h1 className="text-3xl font-extrabold text-center mb-10 text-white drop-shadow">
        🛒 Product Comparison
      </h1>

      {compareProducts.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No products selected for comparison.
        </p>
      ) : categoryMismatch ? (
        <p className="text-center text-red-500 text-lg font-semibold">
          Not comparing same category
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-inner bg-[#1f1f1f]">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-[#2b2b2b] text-gray-200">
                  <th className="border border-gray-700 p-4 text-left text-lg">
                    Details
                  </th>
                  {compareProducts.map((product) => (
                    <th
                      key={product._id}
                      className="border border-gray-700 p-4"
                    >
                      <img
                        src={product.image}
                        className="h-50 w-50 object-contain mx-auto rounded-md shadow-lg"
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
                  {
                    label: "Sentiment",
                    key: "sentiment",
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
                        {row.key === "sentiment"
                          ? product.sentiment?.fullText || ""
                          : product[row.key]}
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
        </>
      )}
      <div className="w-[1050px] h-[650px] mb-10 relative z-10">
        <h1 className="mt-20 text-3xl font-extrabold text-white drop-shadow">
          Price Comparison
        </h1>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 100, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={0}
              textAnchor="end"
              interval={0}
              tick={{ fill: "rgba(255, 255, 255, 0.7)" }}
            />{" "}
            <YAxis domain={[0, "dataMax + 200"]} />
            <Tooltip
              cursor={{ fill: "rgba(204, 204, 204, 0.2)" }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="price" activeBar={false}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mt-10 space-x-4">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-lg transition"
        >
          ← Back
        </button>
        <button
          onClick={captureComparison}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
        >
          Share
        </button>
      </div>

      {showShareOptions && capturedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 p-4">
          <h2 className="text-white text-2xl mb-4">Share Comparison</h2>
          <img
            src={capturedImage}
            alt="Comparison"
            className="max-w-full max-h-96 mb-4 rounded-lg shadow-lg"
          />
          <div className="flex justify-center gap-4">
            <FacebookShareButton
              url={window.location.href}
              quote="Check out this comparison!"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <WhatsappShareButton
              url={window.location.href}
              title="Check out this comparison!"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
          <div className="space-x-4 mt-4">
            <button
              onClick={shareOnTwitter}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
            >
              Twitter
            </button>
            <button
              onClick={downloadImage}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
            >
              Download Image
            </button>
            <button
              onClick={() => setShowShareOptions(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded ml-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
