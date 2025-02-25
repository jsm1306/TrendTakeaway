import mongoose from "mongoose";

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ text: String, votes: Number }],
}, { timestamps: true });

const Poll = mongoose.model("Poll", PollSchema);
export default Poll;
