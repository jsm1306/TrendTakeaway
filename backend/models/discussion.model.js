import mongoose from "mongoose";

const DiscussionSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    sub: { type: String, required: true }, //auth0id
    
  },
  text: { type: String, required: true },
  likes: [{ type: String }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discussion" }],
}, { timestamps: true });

const Discussion = mongoose.model("Discussion", DiscussionSchema);
export default Discussion;
