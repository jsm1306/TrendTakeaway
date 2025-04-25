import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";
import { auth } from "express-openid-connect";

import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import discussionRoutes from "./routes/discussion.routes.js";
import pollRoutes from "./routes/poll.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const inProduction = process.env.NODE_ENV === "production";
const __dirname = path.resolve(); // needed to use path correctly

// Auth0 Config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER,
};

app.use(auth(config));

// Connect DB
connectDB().then(() => {
  console.log("Database connected successfully.");

  app.use(
    cors({
      origin: [
        "http://localhost:5173", // Dev
        "https://trendtakeaway.onrender.com", // Replace with actual Render frontend URL
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/polls", pollRoutes);
  app.use("/api/discussions", discussionRoutes);
  if (inProduction) {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
