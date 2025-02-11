import express from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import checkJwt from "../utils/authMiddleware.js"; // 🔹 Import JWT middleware

const router = express.Router();

router.get("/", getProducts); // Public route
router.post("/", checkJwt, createProduct); // ✅ Protected
router.delete("/:id", checkJwt, deleteProduct); // ✅ Protected
router.put("/:id", checkJwt, updateProduct); // ✅ Protected

export default router;
