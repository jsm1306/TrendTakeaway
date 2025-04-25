import Product from "../models/product.model.js";
import mongoose from "mongoose";

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ message: "No product with that ID", success: false });
  }

  try {
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

export const getRecommendedProductsByProductId = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(404)
      .json({ message: "Invalid product ID", success: false });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const productsInCategory = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    });

    // Feature vector: [price, ratings, positivePercentage, confidencePercentage]
    const baseVector = [
      product.price || 0,
      product.ratings || 0,
      product.sentiment?.positivePercentage || 0,
      product.sentiment?.confidencePercentage || 0,
    ];

    const productsWithSimilarity = productsInCategory.map((p) => {
      const compareVector = [
        p.price || 0,
        p.ratings || 0,
        p.sentiment?.positivePercentage || 0,
        p.sentiment?.confidencePercentage || 0,
      ];
      const similarity = cosineSimilarity(baseVector, compareVector);
      return { product: p, similarity };
    });

    productsWithSimilarity.sort((a, b) => b.similarity - a.similarity);

    const top3 = productsWithSimilarity.slice(0, 3).map((item) => item.product);

    res.status(200).json(top3);
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};
