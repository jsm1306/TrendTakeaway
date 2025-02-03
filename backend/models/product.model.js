import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["TV", "Headphones", "Smart Watch"],
  },
  price: { type: Number, required: true },
  ratings: { type: Number, min: 0, max: 5 },
  reviews: { type: [String] },
  image: { type: String },
  specifications: { type: String },
});

// Create a model
const Product = mongoose.model("Product", ProductSchema);
export default Product;
