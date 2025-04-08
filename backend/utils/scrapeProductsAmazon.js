import puppeteer from "puppeteer";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { connectDB } from "../config/db.js";
import { URL } from "url";

async function scrapeAmazonCategoryPage(categoryUrl) {
  await connectDB();

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(categoryUrl, { waitUntil: "domcontentloaded", timeout: 0 });

  try {
    let productLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ".p13n-sc-uncoverable-faceout a.a-link-normal"
        )
      )
        .map((link) => link.href)
        .filter((href) => href.includes("/dp/"));
    });

    const uniqueProductLinks = Array.from(
      new Set(
        productLinks.map((link) => {
          const url = new URL(link);
          return `https://www.amazon.in${url.pathname}`;
        })
      )
    );

    console.log(`Found ${uniqueProductLinks.length} unique product links.`);

    for (let link of uniqueProductLinks) {
      console.log(`Scraping product: ${link}`);
      try {
        const productDetails = await scrapeAmazonProduct(link, browser);
        if (productDetails) {
          await Product.findOneAndUpdate(
            { name: productDetails.name },
            productDetails,
            { upsert: true, new: true }
          );
        }
      } catch (err) {
        console.error(`Failed to scrape ${link}`, err);
      }
    }
  } catch (error) {
    console.error("Error scraping category page:", error);
  } finally {
    await browser.close();
    mongoose.connection.close();
  }
}

async function scrapeAmazonProduct(url, browser) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

  try {
    const productData = await page.evaluate(() => {
      const getText = (selector) =>
        document.querySelector(selector)?.innerText.trim() || null;

      const extractReviewTexts = () => {
        return Array.from(
          document.querySelectorAll("span[data-hook='review-body'] span")
        )
          .map((el) => el.innerText.trim())
          .filter((text) => text.length > 0);
      };

      const extractSpecs = () => {
        const container = document.querySelector(
          "#productOverview_feature_div"
        );
        if (!container) return "No specifications available";

        return Array.from(container.querySelectorAll("tr"))
          .map((row) => {
            const key = row.querySelector("td:nth-child(1)")?.innerText.trim();
            const value = row
              .querySelector("td:nth-child(2)")
              ?.innerText.trim();
            return key && value ? `${key}: ${value}` : null;
          })
          .filter(Boolean)
          .join(", ");
      };

      let brandText =
        getText("a#bylineInfo") ||
        getText("span#bylineInfo") ||
        "Brand not available";
      brandText = brandText
        .replace(/^Visit the\s+/i, "")
        .replace(/^Brand:\s+/i, "")
        .replace(/\s+Store$/, "");

      const priceWhole = getText(".a-price-whole") || "0";
      const priceFraction = getText(".a-price-fraction") || "00";
      const price = `${priceWhole}.${priceFraction}`.replace(/[^0-9.]/g, "");

      const ratingText = getText("span.a-icon-alt");
      const rating = ratingText ? parseFloat(ratingText.split(" ")[0]) : null;

      return {
        name: getText("#productTitle") || "Name not available",
        category: "Electronics",
        price: parseFloat(price),
        image:
          document.querySelector("#imgTagWrapperId img")?.src || "No image",
        brand: brandText,
        reviews: extractReviewTexts(),
        company: "Amazon",
        URL: window.location.href,
        specifications: extractSpecs(),
        ratings: rating,
      };
    });

    console.log("Scraped:", productData);
    return productData;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  } finally {
    await page.close();
  }
}

// Start scraping
const amazonCategoryUrl =
  "https://www.amazon.in/gp/new-releases/electronics/1388867031";
scrapeAmazonCategoryPage(amazonCategoryUrl);
