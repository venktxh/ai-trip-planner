import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate-trip", async (req, res) => {
  try {
    const { location, days, people, budget } = req.body;

    const prompt = `You are a helpful travel assistant. Generate a valid JSON response only.

Input:
- Location: ${location}
- Days: ${days}
- People: ${people}
- Budget: ${budget}

Your task is to create a complete travel plan in JSON format.

✅ JSON must contain exactly two keys:
1. "hotels": An array of up to 4 hotel objects, each with:
- name (string)
- address (string)
- price (string or number)
- rating (number out of 5)
- geoCoordinates (object with latitude and longitude as numbers)
- imageURL (string)
- description (string)

2. "itinerary": An array of multiple place objects (not grouped). Each object represents **one place** and must include:
- day (number): The day of the trip (can repeat, e.g. multiple items with day = 1)
- placeName (string)
- placeDetails (string)
- imageURL (string)
- geoCoordinates (object with latitude and longitude as numbers)
- ticketPricing (string or null)
- travelTime (string or null)
- bestTime (string or null)

📌 Rules:
- Generate multiple itinerary entries for each day (not just one place per day).
- Use only the exact field names shown above.
- Do NOT include any markdown (like \`\`\`) or any extra explanation.
- Return a valid JSON object with "hotels" and flat "itinerary" array.
- If any field value is unknown, use null.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("🔍 Gemini raw response:\n", text);

    const cleaned = text.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(cleaned);
      res.json(parsed);
    } catch (err) {
      console.warn("⚠️ Could not parse response as JSON, sending raw text.");
      res.json({ raw: text });
    }
  } catch (err) {
    console.error("🔥 Gemini API error:", err.message);
    res.status(500).json({
      error: "Failed to generate trip plan. Gemini may be overloaded. Try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
