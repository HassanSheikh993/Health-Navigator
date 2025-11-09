// server/utils/structureReport.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // Replace with your key

export const structureMedicalReport = async (extractedText) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free", // reliable free model
        messages: [
          {
            role: "system",
            content: `You are a medical data extraction expert. Your job is to analyze raw OCR medical report text and convert it into structured JSON.`,
          },
          {
            role: "user",
            content: `Here is the extracted medical report text:\n\n${extractedText}\n\nConvert it into valid JSON with this exact structure:

{
  "patient": {
    "name": "",
    "age": "",
    "gender": "",
    "report_date": ""
  },
  "tests": [
    {
      "test_name": "",
      "result": "",
      "unit": "",
      "normal_range": "",
      "flag": "High" | "Low" | "Normal"
    }
  ],
  "summary": "Short summary of key findings"
}

⚠️ Important: Return only valid JSON (no markdown, no explanation).`,
          },
        ],
      }),
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    // Ensure we safely parse valid JSON only
    if (!content) throw new Error("No structured content returned");
    const cleanJson = content.trim().replace(/^```json|```$/g, "");
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("Error structuring medical report:", err);
    return null;
  }
};
