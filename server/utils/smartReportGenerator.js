import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 
const OCR_SERVICE_URL = "http://localhost:5001/extract";

export const generateSmartReport = async (filePath) => {
  try {
    console.log("📄 Sending file to OCR service...");

    // ✅ Always use absolute path
    const absolutePath = path.resolve(filePath);
    console.log("📂 Absolute file path:", absolutePath);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(absolutePath));

    const ocrResponse = await fetch(OCR_SERVICE_URL, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const rawText = await ocrResponse.text();
    console.log("🧾 Raw OCR response:", rawText);

    const ocrData = JSON.parse(rawText);
    const extractedText = ocrData.extracted_text || ocrData.text || "";
    if (!extractedText) throw new Error("No text extracted from OCR service.");

    console.log("✅ OCR Extraction Completed");


    // 2️⃣ Send extracted text to LLM to structure into JSON
    console.log("🧠 Structuring extracted data...");
    const structureResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
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
    const structuredText = structuredResult?.choices?.[0]?.message?.content;
    if (!structuredText) throw new Error("Failed to structure report text.");

    console.log("✅ Structured JSON generated");

    // 3️⃣ Generate Smart Report using structured JSON
    console.log("🩺 Generating final smart report...");
    const reportResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "system",
            content: `You are a medical AI assistant that formats all output strictly in clean Markdown, suitable for rendering directly on a website or document viewer. 
- Use Markdown headings (#, ##, ###), bullet lists (-, *) and bold text (**text**) where appropriate.
- Do NOT include any JSON, code blocks, or escape sequences like \\n or \\t.`,
          },
          {
            role: "user",
            content: `Here is the structured JSON medical report:
${structuredText}

Now generate a detailed Smart Health Report in professional Markdown format with these sections:
1. Patient Profile
2. Summary of Results
3. Detailed Test Explanations
4. Overall Interpretation
5. Recommendations
6. Disclaimer`,
          },
        ],
      }),
    });

    const finalResult = await reportResponse.json();
    const rawReport = finalResult?.choices?.[0]?.message?.content || "No report generated.";

    // 🧹 Cleanup to ensure readable markdown
    const smartReport = rawReport
      .replace(/\\n/g, "\n")
      .replace(/\*\*/g, "**")
      .trim();

    console.log("✅ Smart report generated successfully");
    return { success: true, report: smartReport };
  } catch (error) {
    console.error("❌ Error generating Smart Report:", error.message);
    return { success: false, report: `Error: ${error.message}` };
  }
};
