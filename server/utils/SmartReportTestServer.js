import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";

const OPENROUTER_API_KEY = "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";
const OCR_SERVICE_URL = "http://localhost:5001/extract";

export const generateSmartReport = async (filePath) => {
  try {
    console.log("📄 Sending file to OCR service...");

    // 1️⃣ OCR Extraction
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const ocrResponse = await fetch(OCR_SERVICE_URL, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const ocrData = await ocrResponse.json();
    const extractedText = ocrData.extracted_text || ocrData.text || "";

    if (!extractedText) throw new Error("No text extracted from OCR service.");
    console.log("✅ OCR Extraction Completed");

    // 2️⃣ Structure the text into JSON
    console.log("🧠 Structuring extracted data...");
    const structureResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Health Navigator",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // ✅ stable model
        messages: [
          {
            role: "system",
            content: "You are an AI that structures raw medical report text into clean, machine-readable JSON format.",
          },
          {
            role: "user",
            content: `Convert the following medical report text into structured JSON:\n${extractedText}`,
          },
        ],
      }),
    });

    const structuredResult = await structureResponse.json();
    const structuredText = structuredResult?.choices?.[0]?.message?.content?.trim();

    if (!structuredText) {
      console.error("⚠️ Structure step failed:", structuredResult);
      throw new Error("Failed to structure report text.");
    }

    console.log("✅ Structured JSON generated");

    // 3️⃣ Generate Smart Report
    console.log("🩺 Generating final Smart Report...");
    const reportResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Health Navigator",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free", // ✅ same stable model
        messages: [
          {
            role: "system",
            content:
              "You are a medical AI assistant that converts structured medical data into a clear, patient-friendly Smart Health Report.",
          },
          {
            role: "user",
            content: `Here is the structured JSON medical report:\n${structuredText}\n\nGenerate a detailed Smart Health Report with these sections:\n1. Patient Profile\n2. Summary of Results\n3. Detailed Test Explanations\n4. Overall Interpretation\n5. Recommendations\n6. Disclaimer.`,
          },
        ],
      }),
    });

    const finalResult = await reportResponse.json();
    const smartReport = finalResult?.choices?.[0]?.message?.content?.trim() || "⚠️ No report generated.";

    console.log("✅ Smart report generated successfully");
    return { success: true, report: smartReport };
  } catch (error) {
    console.error("❌ Error generating Smart Report:", error.message);
    return { success: false, report: `Error: ${error.message}` };
  }
};
