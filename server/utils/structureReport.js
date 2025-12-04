// structureReport.js (REWRITTEN CLEAN & BULLET-PROOF)
import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";
import path from "path";
import dotenv from "dotenv";
import { runLiverPrediction } from "../AI_Model/runLiverPrediction.js";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OCR_SERVICE_URL = "http://localhost:5001/extract";

// ---------------------------
// 🔒 JSON Schema Normalizer
// ---------------------------
function normalizeStructuredJSON(data) {
  const safe = {
    patient: {
      name: data?.patient?.name || "",
      age: data?.patient?.age || "",
      gender: data?.patient?.gender || ""
    },
    tests: Array.isArray(data?.tests)
      ? data.tests.map(t => ({
          name: t?.name || "",
          value: t?.value || "",
          unit: t?.unit || "",
          range: t?.range || "",
          flag: t?.flag || ""
        }))
      : [],
    remarks: data?.remarks || ""
  };
  return safe;
}

// ---------------------------
// 🔒 Safe Number Parser
// ---------------------------
function safeNumber(x) {
  if (x === null || x === undefined || x === "" || isNaN(Number(x))) return 0;
  return Number(x);
}

export const structureReport = async (filePath) => {
  try {
    console.log("📄 Sending file to OCR service...");
    const absolutePath = path.resolve(filePath);
    console.log("📂 Absolute file path:", absolutePath);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(absolutePath));

    // ---------------------------
    // 🔍 OCR Extraction
    // ---------------------------
    const ocrResponse = await fetch(OCR_SERVICE_URL, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const rawText = await ocrResponse.text();
    console.log("🧾 Raw OCR:", rawText);

    let ocrData;
    try {
      ocrData = JSON.parse(rawText);
    } catch (e) {
      throw new Error("OCR returned invalid JSON → " + rawText);
    }

    const extractedText = ocrData.extracted_text || ocrData.text || "";
    if (!extractedText) throw new Error("OCR extracted no text.");

    console.log("✅ OCR Extraction Completed");

    // ---------------------------
    // 🤖 LLM Structuring (UPDATED PROMPT)
    // ---------------------------
    console.log("🧠 Sending text to LLM for structuring...");

    const structureResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-safeguard-20b",
        messages: [
          {
            role: "system",
            content: `You extract medical report information and return ONLY valid JSON.

RULES:
1. The JSON structure must ALWAYS match the schema below.
2. You MUST include ALL fields. No missing keys, no renaming.
3. Values may be "" or null if unavailable, but keys must exist.
4. Test names must NEVER be changed. If a test is missing, include it with null value.

STRICT JSON SCHEMA:
{
  "patient": {
    "name": "",
    "age": "",
    "gender": ""
  },
  "tests": [
    {
      "name": "",
      "value": "",
      "unit": "",
      "range": "",
      "flag": ""
    }
  ],
  "remarks": ""
}

Return ONLY JSON. No text before or after.`
          },
          {
            role: "user",
            content: `Extract the structured JSON from the following medical report:\n${extractedText}`
          },
        ],
      }),
    });

    const llmJson = await structureResponse.json();
    console.log("🔍 FULL OpenRouter Response:", JSON.stringify(llmJson, null, 2));
// If API returned an error, throw immediately
if (llmJson?.error || llmJson?.detail) {
  console.log("❌ OpenRouter Error:", llmJson);
  throw new Error("OpenRouter API Error → " + JSON.stringify(llmJson));
}

const rawLLMText =
  llmJson?.choices?.[0]?.message?.content ||
  llmJson?.output_text ||
  llmJson?.output?.[0]?.content ||
  llmJson?.message ||
  "";


    console.log("🧠 LLM Raw Output:", rawLLMText);

    if (!rawLLMText) throw new Error("LLM returned empty content.");

    // ---------------------------
    // 🧹 Extract ONLY JSON using regex
    // ---------------------------
    const jsonMatch = rawLLMText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in LLM response.");
    }

    const cleanJSON = jsonMatch[0].trim();

    let parsedJSON;
    try {
      parsedJSON = JSON.parse(cleanJSON);
    } catch (e) {
      console.log("❌ JSON extraction failed. Raw cleaned JSON:", cleanJSON);
      throw new Error("LLM returned invalid JSON. Parsing failed.");
    }

    console.log("✅ JSON Structured Successfully");

    // ---------------------------
    // 🔒 Normalize JSON (NEW)
    // ---------------------------
    parsedJSON = normalizeStructuredJSON(parsedJSON);

    // ---------------------------
    // 🔢 Convert tests array to ML-friendly map
    // ---------------------------
    const testMap = {};
    if (Array.isArray(parsedJSON.tests)) {
      for (const t of parsedJSON.tests) {
        if (!t.name || t.value == null) continue;
        const key = t.name.toLowerCase().replace(/\s+/g, "_");
        testMap[key] = Number(t.value);
      }
    }

    // ---------------------------
    // 🔒 REQUIRED TEST Fallbacks (NEW)
    // ---------------------------
    const REQUIRED_TESTS = [
      "total_bilirubin",
      "direct_bilirubin",
      "alkphos",
      "sgpt",
      "sgot",
      "total_proteins",
      "albumin",
      "ag_ratio"
    ];

    for (const k of REQUIRED_TESTS) {
      if (!testMap[k]) testMap[k] = 0;
    }

    // ---------------------------
    // 🧠 Build ML Input (UPDATED safeNumber)
    // ---------------------------
    const mlData = {
      age: safeNumber(parsedJSON?.patient?.age),
      gender: parsedJSON?.patient?.gender || "",

      total_bilirubin: safeNumber(
        testMap["serum_bilirubin_(total)"] || testMap["total_bilirubin"]
      ),
      direct_bilirubin: safeNumber(
        testMap["serum_bilirubin_(direct)"] || testMap["direct_bilirubin"]
      ),

      alkphos: safeNumber(testMap["serum_alkaline_phosphatase"] || testMap["alkphos"]),

      sgpt: safeNumber(testMap["sgpt_(alt)"] || testMap["sgpt"]),
      sgot: safeNumber(testMap["sgot_(ast)"] || testMap["sgot"]),

      total_proteins: safeNumber(testMap["serum_protein"] || testMap["total_protein"]),
      albumin: safeNumber(testMap["serum_albumin"] || testMap["albumin"]),

      ag_ratio: safeNumber(testMap["aig_ratio"] || testMap["ag_ratio"]),
    };

    console.log("🧪 ML Input:", mlData);

    // ---------------------------
    // 🤖 Run ML Model
    // ---------------------------
    const prediction = await runLiverPrediction(mlData);
    console.log(prediction);

    return {
      success: true,
      structured: parsedJSON,
      structuredText: cleanJSON,
      ml_result: prediction.result,
    };
  } catch (error) {
    console.error("❌ Error structuring report:", error);
    return {
      success: false,
      structuredText: "",
      error: error?.message || String(error),
    };
  }
};
