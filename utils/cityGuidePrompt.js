export function buildCityGuidePrompt(city) {
  return `
You are a friendly *local guide* for the city: "${city}".

Return strictly JSON (no explanations) with this shape:
{
  "city": string,
  "summary": string, // 2-3 sentences vibe of the city with some humor
  "sections": {
    "historyMonuments": [ { "name": string, "why": string, "neighborhood": string } ],
    "clubsBars":       [ { "name": string, "why": string, "neighborhood": string } ],
    "parksNature":     [ { "name": string, "why": string, "neighborhood": string } ],
    "shopping":        [ { "name": string, "why": string, "neighborhood": string } ]
  }
}

Rules:
- 2–4 items per section.
- Keep "why" short and punchy (<= 18 words).
- Prefer well-known, *safe* spots. Avoid adult content.
- If unsure, say fewer items; never fabricate specific addresses.
`;
}
