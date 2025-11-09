// services/generateSmartReport.js
import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";
import path from "path";
import { structureReport } from "./structureReport.js";
import { generateSmartHealthReport } from "./smartReportGenerator.js";

const OCR_SERVICE_URL = "http://localhost:5001/extract";

export const generateSmartReport = async (filePath) => {
  try {
    console.log("📄 Sending file to OCR service...");

    const absolutePath = path.resolve(filePath);
    const formData = new FormData();
    formData.append("file", fs.createReadStream(absolutePath));

    const ocrResponse = await fetch(OCR_SERVICE_URL, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const ocrData = await ocrResponse.json();
    const extractedText = ocrData.extracted_text || ocrData.text || "";

    if (!extractedText) throw new Error("No text extracted from OCR service.");

    console.log("✅ OCR Extraction Completed");

    // 1️⃣ Structure the report into JSON
    const structuredText = await structureReport(extractedText);

    // 2️⃣ Generate Smart Markdown Report
    const smartReport = await generateSmartHealthReport(structuredText);

    // 3️⃣ Return final result
    return { success: true, report: smartReport };
  } catch (error) {
    console.error("❌ Error generating Smart Report:", error.message);
    return { success: false, report: `Error: ${error.message}` };
  }
};
