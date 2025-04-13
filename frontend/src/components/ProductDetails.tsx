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

      {/* Customer Reviews Section */}
      <div className="bg-gray-800 mt-40 ml-5 mr-5 p-6 rounded-lg shadow-lg  mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Customer Reviews
        </h2>
        <p className="text-gray-300">{product.reviews}</p>
      </div>
    </div>
  );
}

export default ProductDetails;
