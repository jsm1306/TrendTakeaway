import Product from "../models/product.model.js";
import mongoose from "mongoose";
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    // console.log("Fetched Products:", products);
    res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};
export const getProductById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ message: "No product with that ID", success: false });
  }

  try {
    // Query the database for the product by ID
    const product = await Product.findById(id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found", success: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};
export const createProduct = async (req, res) => {
  const product = req.body;
  if (
    !product.name ||
    !product.image ||
    !product.price ||
    !product.category ||
    !product.ratings ||
    !product.reviews ||
    !product.specifications
  ) {
    return res
      .status(400)
      .json({ message: "Please fill all the fields", success: false });
  }
  const newproduct = new Product(product);
  try {
    await newproduct.save();
    res.status(201).json({ data: newproduct, success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Product deleted successfully", success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ message: "No product with that id", success: false });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
    res.status(200).json({ data: updatedProduct, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};
