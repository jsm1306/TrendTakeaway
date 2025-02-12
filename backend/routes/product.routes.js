import express from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import checkJwt from "../utils/authMiddleware.js"; 

const router = express.Router();

router.get("/", getProducts); // Public route
router.post("/", checkJwt, createProduct); 
router.delete("/:id", checkJwt, deleteProduct); 
router.put("/:id", checkJwt, updateProduct); 

export default router;
