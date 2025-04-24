import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "TV",
      "Headphones",
      "Smart Watch",
      "Fridge",
      "Laptop",
      "Oven",
      "Tablet",
      "Others",
      "Cooler",
      "HairDryers",
      "Washing Machine",
      "AC",
      "Phone",
      "Fan",
      "Electronics",
    ],
  },
  price: { type: Number, required: true },
  ratings: { type: Number, min: 0, max: 5 },
  reviews: { type: [String] },
  image: { type: String },
  brand: { type: String },
  company: { type: String },
  specifications: { type: String },
  URL: { type: String },
  sentiment: {
    fullText: { type: String },
    positivePercentage: { type: Number },
    confidencePercentage: { type: Number },
    summary: String,
  },
});

// Create a model
const Product = mongoose.model("Product", ProductSchema);
export default Product;
