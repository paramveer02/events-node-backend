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

// Helper to extract JSON from text that might have markdown code blocks
function extractJSON(text) {
  // First try: direct parse
  try {
    return JSON.parse(text);
  } catch (e) {
    // Ignore, try other methods
  }

  // Second try: extract from markdown code block
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (e) {
      // Ignore, try next method
    }
  }

  // Third try: find JSON object in text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Ignore
    }
  }

  return null;
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
        temperature: 0.7,
        maxOutputTokens: 1000,
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

    console.log("[AI DEBUG] Raw response length:", raw.length);
    console.log("[AI DEBUG] Raw response preview:", raw.substring(0, 300));

    const payload = extractJSON(raw);

    if (!payload) {
      console.error(
        "[AI] getCityGuide - Could not parse JSON. Raw response:",
        raw
      );
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
        temperature: 0.7,
        maxOutputTokens: 1000,
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

    console.log("[AI DEBUG] City:", targetCity);
    console.log("[AI DEBUG] Raw response length:", raw.length);
    console.log("[AI DEBUG] Raw response preview:", raw.substring(0, 300));

    const payload = extractJSON(raw);

    if (!payload) {
      console.error(
        "[AI] getCityGuideQuery - Could not parse JSON. Raw response:",
        raw
      );
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
