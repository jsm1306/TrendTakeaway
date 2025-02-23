import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from './routes/user.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import cors from "cors";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    console.log("Database connected successfully.");
    app.use(cors({
        origin: "http://localhost:5173", 
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Headers"]
    }));

    app.use(express.json());

    app.use("/api/products", productRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/wishlist', wishlistRoutes);


    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });

}).catch(err => {
    console.error("Database connection failed:", err);
});
