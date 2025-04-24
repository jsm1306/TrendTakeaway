import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import Product from "../models/product.model.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function summarizeText(text) {
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: text,
  });
  return result.candidates[0].content.parts[0].text;
}

async function updateProductSummaries() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const products = await Product.find();

    for (const product of products) {
      const reviews = product.reviews;

      if (reviews && reviews.length > 0) {
        const prompt = `Summarize these customer reviews in a concise, human-like way without using any introduction phrases like "here's a summary". Write as if you're confidently describing the product's performance based on collective user experience. Avoid symbols like * or - and keep it natural. The summary should be 2-3 sentences max, mentioning both positives and negatives directly. 
Reviews:${reviews.join("\n")}`;

        const summary = await summarizeText(prompt);

        product.sentiment.summary = summary;

        await product.save();
        console.log(`Summary updated for product: ${product.name}`);
      }
    }

    console.log("All summaries updated!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

updateProductSummaries();
