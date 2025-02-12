// backend/models/user.model.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true }, // Store Auth0 user ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String }, // Store user profile picture from Auth0
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
export default User;
