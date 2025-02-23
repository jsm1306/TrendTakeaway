import mongoose from "mongoose";
import Wishlist from "../models/wishlist.model.js";

export const getWishlist = async (req, res) => {
  const { auth0Id } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ auth0Id }).populate("products");
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
export const createWishlist = async (req, res) => {
  const { auth0Id, productId } = req.body;
  try {
    if (!auth0Id || !productId) {
      return res.status(400).json({ success: false, error: err.message });
    }
    let wishlist = await Wishlist.findOne({ auth0Id });
    if (!wishlist) {
      wishlist = new Wishlist({ auth0Id, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(409).json({ success: false, message: "Item already in wishlist" });
      }
      wishlist.products.push(productId);
    }
    await wishlist.save();
    res.status(201).json({ success: true, message: "Item added to wishlist", data: wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const deleteWishlist = async (req, res) => {
  const { auth0Id, productId } = req.params;
  try {
    let wishlist = await Wishlist.findOne({ auth0Id });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();
    res.status(200).json({ success: true, message: "Wishlist item removed successfully", data: wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
