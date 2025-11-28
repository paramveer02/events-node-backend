// src/utils/aiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

let genAI = null;
let cityGuideModel = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  cityGuideModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
  });
  console.log("✅ AI features enabled - GEMINI_API_KEY configured");
} else {
  console.warn(
    "⚠️  GEMINI_API_KEY not found - AI city guide features will be disabled"
  );
}

export { genAI, cityGuideModel };
