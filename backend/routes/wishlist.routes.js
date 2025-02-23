import express from 'express';
import { getWishlist, createWishlist, deleteWishlist } from '../controllers/wishlist.controller.js';
import checkJwt from "../utils/authMiddleware.js"; 

const router = express.Router();
 router.get("/user/:auth0Id",checkJwt, getWishlist);
router.post("/add", checkJwt, createWishlist);
router.delete("/:auth0Id/:productId", checkJwt, deleteWishlist);


export default router;
