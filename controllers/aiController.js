// src/controllers/aiController.js
import { z } from "zod";
import { cityGuideModel } from "../utils/aiClient.js";
import { buildCityGuidePrompt } from "../utils/cityGuidePrompt.js";
import { reverseGeocode } from "../utils/geoCode.js";

const CityGuideInput = z.object({
  city: z.string().trim().min(1).optional(),
  coords: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

// small helper to safely extract text from any Gemini response shape
function extractText(resp) {
  // 1) try SDK helper
  if (typeof resp?.text === "function") {
    const t = resp.text();
    if (t && t.trim()) return t;
  }
  // 2) manually read first candidate parts
  const parts = resp?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const joined = parts
      .map((p) => p?.text || "")
      .join("")
      .trim();
    if (joined) return joined;
  }
  return "";
}

export async function getCityGuide(req, res) {
  try {
    // Check if AI features are available
    if (!cityGuideModel) {
      return res.status(503).json({
        status: "fail",
        message:
          "AI city guide features are not available. GEMINI_API_KEY is not configured.",
      });
    }

    const parsed = CityGuideInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid payload",
        issues: parsed.error.issues,
      });
    }

    let city = parsed.data.city;
    if (!city && parsed.data.coords) {
      city = await reverseGeocode(
        parsed.data.coords.lat,
        parsed.data.coords.lng
      );
    }
    if (!city) {
      return res
        .status(400)
        .json({ status: "fail", message: "City not provided or resolvable" });
    }

    const prompt = buildCityGuidePrompt(city);

    const result = await cityGuideModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
      },
    });

    const raw = extractText(result?.response);
    if (!raw) {
      // Log once for debugging, then return a helpful message
      console.error(
        "[AI] Empty response",
        JSON.stringify(result?.response || {}, null, 2)
      );
      return res
        .status(502)
        .json({ status: "error", message: "Empty AI response from model" });
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}$/);
      if (match) {
        payload = JSON.parse(match[0]);
      }
    }

    if (!payload) {
      console.error("[AI] Could not parse JSON:", raw);
      return res
        .status(502)
        .json({ status: "error", message: "Failed to parse AI JSON" });
    }

    return res.status(200).json({ status: "success", data: payload });
  } catch (err) {
    console.error("[AI] getCityGuide error:", err);
    return res
      .status(500)
      .json({ status: "error", message: "AI guide failed" });
  }
}

// GET endpoint that accepts query parameters
export async function getCityGuideQuery(req, res) {
  try {
    // Check if AI features are available
    if (!cityGuideModel) {
      return res.status(503).json({
        status: "fail",
        message:
          "AI city guide features are not available. GEMINI_API_KEY is not configured.",
      });
    }

    // Extract from query parameters
    const { city, lat, lng } = req.query;

    let targetCity = city;

    // If coordinates provided, do reverse geocoding
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      if (
        !isNaN(latitude) &&
        !isNaN(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      ) {
        targetCity = await reverseGeocode(latitude, longitude);
      }
    }

    if (!targetCity) {
      return res.status(400).json({
        status: "fail",
        message: "City name or valid coordinates (lat, lng) are required",
      });
    }

    const prompt = buildCityGuidePrompt(targetCity);

    const result = await cityGuideModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
      },
    });

    const raw = extractText(result?.response);
    if (!raw) {
      console.error(
        "[AI] Empty response",
        JSON.stringify(result?.response || {}, null, 2)
      );
      return res
        .status(502)
        .json({ status: "error", message: "Empty AI response from model" });
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}$/);
      if (match) {
        payload = JSON.parse(match[0]);
      }
    }

    if (!payload) {
      console.error("[AI] Could not parse JSON:", raw);
      return res
        .status(502)
        .json({ status: "error", message: "Failed to parse AI JSON" });
    }

    return res.status(200).json({ status: "success", data: payload });
  } catch (err) {
    console.error("[AI] getCityGuideQuery error:", err);
    return res
      .status(500)
      .json({ status: "error", message: "AI guide failed" });
  }
}
