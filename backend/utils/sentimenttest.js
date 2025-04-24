import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.model.js"; // Adjust the path if needed
import Sentiment from "sentiment";

dotenv.config();
const sentiment = new Sentiment();

const MONGO_URI = process.env.MONGO_URI || "";

function analyzeReviews(reviews) {
  let total = reviews.length;
  let positives = 0;
  let confidenceSum = 0;

  reviews.forEach((review) => {
    const result = sentiment.analyze(review);
    if (result.score > 0) positives++;
    confidenceSum += Math.min(Math.abs(result.score), 5);
  });

  const positivePercentage = ((positives / total) * 100).toFixed(2);
  const confidencePercentage = ((confidenceSum / total) * 20).toFixed(2);

  const fullText = `${positivePercentage}% of reviews are positive, with ${confidencePercentage}% confidence.`;

  return {
    fullText,
    positivePercentage: parseFloat(positivePercentage),
    confidencePercentage: parseFloat(confidencePercentage),
  };
}

async function runSentimentUpdate() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const products = await Product.find();

    for (const product of products) {
      if (product.reviews.length === 0) continue;

      const sentimentResult = analyzeReviews(product.reviews);
      product.sentiment = sentimentResult;

      await product.save();
      console.log(`✅ Updated sentiment for: ${product.name}`);
    }

    console.log("🎉 Sentiment analysis completed for all products.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error during sentiment analysis:", error);
    await mongoose.disconnect();
  }
}

runSentimentUpdate();
