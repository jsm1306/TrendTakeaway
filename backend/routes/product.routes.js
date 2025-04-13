import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  getProductById,
} from "../controllers/product.controller.js";
import checkJwt from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts); // Public route
router.post("/", checkJwt, createProduct);
router.delete("/:id", checkJwt, deleteProduct);
router.put("/:id", checkJwt, updateProduct);
router.get("/:id", getProductById);

export default router;
