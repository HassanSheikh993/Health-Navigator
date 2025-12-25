// structureReport.js
import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OCR_SERVICE_URL = "http://localhost:5001/extract";

export const structureReport = async (filePath) => {
  try {
    console.log("📄 Sending file to OCR service...");
    const absolutePath = path.resolve(filePath);
    console.log("📂 Absolute file path:", absolutePath);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(absolutePath));

    // 🧠 OCR extraction
    const ocrResponse = await fetch(OCR_SERVICE_URL, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const rawText = await ocrResponse.text();
    console.log("🧾 Raw OCR response:", rawText);

    let ocrData;
    try {
      ocrData = JSON.parse(rawText);
    } catch (e) {
      throw new Error("OCR service returned invalid JSON: " + rawText);
    }

    const extractedText = ocrData.extracted_text || ocrData.text || "";
    if (!extractedText) throw new Error("No text extracted from OCR service.");

    console.log("✅ OCR Extraction Completed");

    // 🔧 Structure using LLM
    console.log("🧠 Structuring extracted data...");
    const structureResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: "You are an AI that structures raw medical report text into clean, machine-readable JSON format.",
          },
          {
            role: "user",
            content: `Convert the following medical report text into structured JSON:
${extractedText}

Example JSON:
{
  "patient": {"name": "...", "age": "...", "gender": "..."},
  "tests": [
    {"name": "ALT", "value": "55", "unit": "U/L", "range": "0–40", "flag": "high"}
  ],
  "remarks": "..."
}`,
          },
        ],
      }),
    });

    const structuredResult = await structureResponse.json();
console.log(structuredResult);
    const structuredText = structuredResult?.choices?.[0]?.message?.content;
console.log(structuredText);
    if (!structuredText) throw new Error("Failed to structure report text.");

    console.log("✅ Structured JSON generated successfully");
    return { success: true, structuredText };
  } catch (error) {
    console.error("❌ Error structuring report:", error.message);
    return { success: false, structuredText: "", error: error.message };
  }
};
