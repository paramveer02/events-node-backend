// src/utils/aiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in env");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Prefer a stable, widely-available model id
export const cityGuideModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
