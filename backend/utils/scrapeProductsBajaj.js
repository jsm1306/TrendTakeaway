import puppeteer from "puppeteer";
import mongoose from "mongoose";
import Product from "../models/product.model.js"; // Adjust the path as needed
import { connectDB } from "../config/db.js"; // Adjust the path as needed

async function scrapeBajajFeaturedProducts(url) {
  await connectDB(); // Connect to MongoDB

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

  try {
    await page.waitForSelector("#divFeaturedCategories", { timeout: 8000 });

    // Extract product links first
    const products = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "#divFeaturedCategories .owl-item .mobileItem"
        )
      ).map((item) => {
        const relativeUrl = item
          .querySelector(".mobileItemCard a")
          ?.getAttribute("href");
        const productUrl = relativeUrl?.startsWith("http")
          ? relativeUrl
          : `https://bajajelectronics.com${relativeUrl}`;

        return {
          name: item.querySelector(".mainDesc")?.innerText.trim() || "No name",
          imageUrl:
            item.querySelector(".mobileItemCard img")?.src || "No image",
          price:
            item.querySelector(".newPrice")?.innerText.trim() || "No price",
          discount:
            item.querySelector(".discount")?.innerText.trim() || "No discount",
          productUrl: productUrl,
        };
      });
    });

    // Loop through each product and extract its description
    for (let i = 0; i < products.length; i++) {
      const prodPage = await browser.newPage();
      try {
        await prodPage.goto(products[i].productUrl, {
          waitUntil: "domcontentloaded",
          timeout: 0,
        });

        // Wait for the product description table
        await prodPage.waitForSelector("#nav-tabContent", { timeout: 8000 });

        const description = await prodPage.evaluate(() => {
          const rows = Array.from(
            document.querySelectorAll(
              "#nav-tabContent .tab-pane.active table tr"
            )
          );
          const details = {};
          rows.forEach((row) => {
            const key = row.querySelector(".ProDecHed")?.innerText.trim();
            const value = row.querySelector(".ProDecSub")?.innerText.trim();
            if (key && value) {
              details[key] = value;
            }
          });
          return details;
        });

        products[i]["specifications"] = description;
        await prodPage.close();
        const brand = description["Brand"] || "Bajaj"; // Default to "Bajaj" if brand is not found

        // Save the product to MongoDB
        const productData = {
          name: products[i].name,
          category: "TV", // Adjust this as needed
          price: parseFloat(products[i].price.replace(/[^0-9.-]+/g, "")),
          ratings: 0, // Default value, adjust as needed
          reviews: [],
          image: products[i].imageUrl,
          brand: brand, // Adjust this as needed
          company: "Bajaj Electronics", // Adjust this as needed
          specifications: JSON.stringify(products[i].description),
          URL: products[i].productUrl,
        };
        await Product.findOneAndUpdate(
          { name: products[i].name }, // Find the product by name
          productData,
          { upsert: true, new: true } // Create a new product if it doesn't exist
        );
      } catch (err) {
        console.error(
          `Failed to scrape description for ${products[i].name}:`,
          err
        );
        await prodPage.close();
      }
    }

    console.log(
      "Final Scraped Products with Descriptions:",
      JSON.stringify(products, null, 2)
    );
  } catch (error) {
    console.error("Error scraping featured products:", error);
  } finally {
    await browser.close();
    mongoose.connection.close(); // Close the MongoDB connection
  }
}

const bajajUrl = "https://bajajelectronics.com";
scrapeBajajFeaturedProducts(bajajUrl);
