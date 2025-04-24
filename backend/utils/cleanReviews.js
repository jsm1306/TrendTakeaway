import mongoose from "mongoose";
import Product from "../models/product.model.js";
import url from "url";

import { franc } from "franc";

function cleanReview(text) {
  if (!text) return "";
  return text
    .replace(/read more/gi, "")
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C\uDC00-\uDFFF]|[\uD83D\uDC00-\uDFFF]|[\u2011-\u26FF]|[\uD83E\uDD10-\uDDFF])/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

function isEnglish(text) {
  return franc(text) === "eng";
}

async function cleanAllProductReviews() {
  try {
    const mongoUri = process.env.MONGO_URI || "";
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const products = await Product.find({});
    console.log(`Found ${products.length} products.`);

    for (const product of products) {
      if (product.reviews && product.reviews.length > 0) {
        const cleanedReviews = product.reviews
          .map(cleanReview)
          .filter(isEnglish);
        const isChanged = cleanedReviews.some(
          (r, i) => r !== product.reviews[i]
        );
        if (isChanged) {
          await Product.findByIdAndUpdate(product._id, {
            reviews: cleanedReviews,
          });
          console.log(`Updated product ${product._id} reviews.`);
        }
      }
    }

    console.log("All product reviews cleaned.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error cleaning product reviews:", error);
  }
}

const __filename = url.fileURLToPath(import.meta.url);
if (__filename === process.argv[1]) {
  cleanAllProductReviews();
}

export { cleanReview, cleanAllProductReviews };
