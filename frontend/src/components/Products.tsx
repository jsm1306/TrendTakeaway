import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Badge } from "./ui/badge";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const Products: React.FC = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  const categories = ["TV", "Headphones", "Smart Watch", "Fridge", "Laptop", "Oven"];
  const brands = ["LG", "boat", "Asus", "HP", "Zebronics", "Panasonic"];
  const companies = ["Amazon", "Flipkart"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: { Accept: "application/json" },
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else if (data && Array.isArray(data.data)) {
          setProducts(data.data);
          setFilteredProducts(data.data);
        } else {
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      }
    };
    const fetchWishlist = async () => {
      if (!user?.sub) return;

      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`http://localhost:5000/api/wishlist/user/${user.sub}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.data.products) {
          setWishlist([...new Set(res.data.data.products.map((item: any) => item._id))]);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchProducts();
    if (isAuthenticated) fetchWishlist();
  }, [isAuthenticated, user?.sub, getAccessTokenSilently]);

  const toggleWishlist = async (productId) => {
    if (!user?.sub) {
        alert("Please log in to add items to the wishlist.");
        return;
    }

    try {
        const token = await getAccessTokenSilently();
        const requestData = { auth0Id: user.sub, productId };

        let updatedWishlist;
        if (wishlist.includes(productId)) {
            await axios.delete(`http://localhost:5000/api/wishlist/${user.sub}/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            updatedWishlist = wishlist.filter(id => id !== productId);
        } else {
            await axios.post("http://localhost:5000/api/wishlist/add", requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updatedWishlist = [...wishlist, productId];
        }
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    } catch (error) {
        console.error("Error updating wishlist:", error.response?.data || error.message);
    }
};

  const handleCompare = (product: any) => {
    if (selectedProducts.some((p) => p._id === product._id)) {
      setSelectedProducts(selectedProducts.filter((p) => p._id !== product._id));
    } else {
      if (selectedProducts.length < 4) {
        setSelectedProducts([...selectedProducts, product]);
      } else {
        alert("You can compare up to 4 products only!");
      }
    }
  };

  const navigateToCompare = () => {
    if (selectedProducts.length < 2) {
      alert("Select at least 2 products to compare!");
      return;
    }
    localStorage.setItem("compareProducts", JSON.stringify(selectedProducts));
    window.location.href = "/compare";
  };

  useEffect(() => {
    let filtered = products;
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (brand) filtered = filtered.filter((p) => p.brand === brand);
    if (company) filtered = filtered.filter((p) => p.company === company);
    setFilteredProducts(filtered);
  }, [category, brand, company, products]);

  const FilterCombobox = ({ label, options, value, setValue }) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between text-black">
  {value || `Select ${label}...`}
  <ChevronsUpDown className="opacity-50" />
</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      setValue(option === value ? "" : option);
                      setOpen(false);
                    }}
                  >
                    {option}
                    <Check className={value === option ? "ml-auto opacity-100" : "ml-auto opacity-0"} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  return (
<div className="bg-gray-900 pl-16 min-h-screen overflow-hidden min-w-screen">
<h1 className="text-3xl font-bold text-center text-white mb-6 pt-6">Products</h1>
{selectedProducts.length > 1 && (
          <button
            onClick={navigateToCompare}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg mt-3 transition-all"
          >
            Compare Now
          </button>
        )}
      <div className="flex justify-center gap-4 mb-6">
        <FilterCombobox label="Category" options={categories} value={category} setValue={setCategory} />
        <FilterCombobox label="Brand" options={brands} value={brand} setValue={setBrand} />
        <FilterCombobox label="Company" options={companies} value={company} setValue={setCompany} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pr-4">
        
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-gray-800 shadow-md rounded-lg overflow-hidden p-5 transition-transform hover:scale-105">
            <img src={product.image} className="w-full h-40 object-cover rounded-lg" alt={product.name} />
            <div className="p-3 text-center">
              <h2 className="text-lg font-semibold text-white">{product.name}</h2>
              <p className="text-gray-400">Price: <span className="font-bold text-yellow-400">₹{product.price}</span></p>
              <p className="text-yellow-500">⭐ {product.ratings} Ratings</p>
              <p className="text-gray-400">Company: {product.company}</p>
              <p className="text-gray-400">Brand: {product.brand}</p>
              <p className="text-gray-400">Category: {product.category}</p>
              <p className="text-gray-400">URL: <a href={product.URL} target="_blank" rel="noopener noreferrer" className="font-bold text-yellow-400">Link</a></p>
              
            </div>
            
        <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`mt-3 px-4 py-2 w-full rounded-lg font-semibold ${
                    wishlist.includes(product._id)
                      ? "bg-pink-500 hover:bg-pink-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  } transition-all duration-300`}
                >
                  {wishlist.includes(product._id) ? (
                    <span style={{ color: 'pink' }}> Wishlisted</span>
                  ) : (
                    <span>  Add to Wishlist</span>
                  )}
                  
                </button>
                <button
                  onClick={() => handleCompare(product)}
                  className={`mt-3 px-4 py-2 w-full rounded-lg font-semibold ${
                    selectedProducts.some((p) => p._id === product._id)
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white transition-all duration-300`}
                >
                  {selectedProducts.some((p) => p._id === product._id)
                    ? " Remove"
                    : " Compare"}
                </button>               <br></br> <br></br>
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default Products;
