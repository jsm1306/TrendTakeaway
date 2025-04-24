// frontend/src/components/ProductDetails.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`${baseUrl}/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  if (!product) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row bg-gray-900 p-6 rounded-lg shadow-lg mt-10 mr-5 gap-10">
        <div className="flex-1 flex justify-center items-start pr-8">
          <img
            src={product.image}
            className="w-300 h-full object-contain rounded-lg border border-gray-700"
          />
        </div>

        {/* Right Section – Details */}
        <div className="flex-1 space-y-4 pl-14">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-yellow-400 text-2xl font-semibold">
            ₹{product.price}
          </p>

          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">
              ⭐️ {product.ratings} Ratings
            </span>
          </div>

          <div className="space-y-2 mt-4 text-gray-300">
            <p>
              <span className="font-semibold text-white">Company:</span>{" "}
              {product.company}
            </p>

            <p>
              <span className="font-semibold text-white">Details:</span>{" "}
              {product.specifications}
            </p>
            <p>
              <span className="font-semibold text-white">Buy Link:</span>{" "}
              <a
                href={product.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 underline"
              >
                Visit Product Page
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* bg-gray-800 mt-40 ml-5 mr-5 p-6 rounded-lg shadow-lg  mx-auto */}
      <div className="bg-gray-800 mt-40 ml-5 mr-5 p-6 rounded-lg shadow-xl mx-auto">
        <h2 className="text-3xl font-bold mb-20 text-yellow-400 text">
          Sentiment Analysis
        </h2>
        <p>
          <span className="font-semibold text-white">Sentiment:</span>{" "}
          {product.sentiment.fullText}
        </p>
      </div>
      <div className="bg-gray-800 mt-40 ml-5 mr-5 p-6 rounded-lg shadow-xl mx-auto">
        <h2 className="text-3xl font-bold mb-20 text-yellow-400 text">
          Summarized Reviews:
        </h2>
        <p>
          <span className="font-semibold text-white">Summary:</span>{" "}
          {product.sentiment.summary}
        </p>
      </div>
      <div className="bg-gray-800 mt-40 ml-5 mr-5 p-6 rounded-lg shadow-xl max-w-8xl">
        <h2 className="text-3xl font-bold mb-20 text-yellow-400 text-center">
          Customer Reviews
        </h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review: string, index: number) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-md shadow-md border-l-4 border-yellow-400"
              >
                <div className="flex items-start gap-2">
                  <svg
                    className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927C9.469 1.875 10.531 1.875 10.951 2.927l1.286 3.536a1 1 0 00.95.69h3.462c1.1 0 1.548 1.357.707 2.036l-2.8 2.158a1 1 0 00-.364 1.118l1.286 3.536c.42 1.052-.871 1.918-1.781 1.24l-2.8-2.158a1 1 0 00-1.214 0l-2.8 2.158c-.91.678-2.201-.188-1.781-1.24l1.286-3.536a1 1 0 00-.364-1.118L2.644 9.189c-.841-.679-.393-2.036.707-2.036h3.462a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                  <p className="text-gray-200 leading-relaxed">{review}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center">No reviews available.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
