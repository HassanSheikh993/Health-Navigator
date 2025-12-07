// structureReport.js (REWRITTEN CLEAN & BULLET-PROOF)
import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";
import path from "path";
import dotenv from "dotenv";
import { isLiverReport } from "../utils/isLiverReport.js";
import { runLiverPrediction } from "../AI_Model/runLiverPrediction.js";
import { normalizeTestName, TEST_NAME_MAP } from "../utils/liverMapping.js";


dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OCR_SERVICE_URL = "http://localhost:5001/extract";

// ---------------------------
// 🔒 JSON Schema Normalizer
function normalizeStructuredJSON(data) {
  return {
    patient: {
      name: data?.patient?.name ?? "",
      age: data?.patient?.age ?? "",
      gender: data?.patient?.gender ?? ""
    },
    tests: Array.isArray(data?.tests)
      ? data.tests.map(t => ({
        name: t?.name ?? "",
        ml_key: t?.ml_key ?? "",
        value: t?.value === null || t?.value === undefined ? null : t.value,
        unit: t?.unit ?? "",
        range: t?.range ?? "",
        flag: t?.flag ?? ""
      }))
      : [],
    remarks: data?.remarks ?? ""
  };
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
    // 🛑 Validate: Is this a Liver Report?
    // ---------------------------
    if (!isLiverReport(extractedText)) {
      console.log("❌ Not a liver report. Rejecting...");
      return {
        success: false,
        structuredText: "",
        error: "❌ Please upload a valid Liver Function Test (LFT) report.",
      };
    }

    console.log("✅ Liver report validated. Continuing...");

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
            content: `You are a medical report parser.  
Your task is to extract Liver Function Test (LFT) values and return them in a STRICT JSON format.

RULES:
1. ALWAYS return only JSON.
2. NEVER rename keys.
3. Each test MUST include an "ml_key" field that matches our predefined ML keys.
4. The value of "ml_key" MUST be one of these:

[
  "total_bilirubin",
  "direct_bilirubin",
  "indirect_bilirubin",
  "sgpt",
  "sgot",
  "alkphos",
  "total_proteins",
  "albumin",
  "globulin",
  "ag_ratio"
]

5. You MUST assign the correct ml_key based on the test name.
6. If a test exists but no numeric value is present → set value = null.
7. If a test does not appear in the report → DO NOT add it. Only include extracted tests.

RETURN STRICT JSON IN THIS FORMAT:

{
  "patient": {
    "name": "",
    "age": "",
    "gender": ""
  },
  "tests": [
    {
      "name": "",
      "ml_key": "",
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
        let val = t.value;
        if (typeof val === "string") {
          val = val.replace("<", "").replace(">", "");
          val = parseFloat(val);
        }
        if (isNaN(val)) val = null;
        testMap[t.ml_key] = val;

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
      if (testMap[k] === undefined) testMap[k] = 0;

    }

    // ---------------------------
    // 🧠 Build ML Input (UPDATED safeNumber)
    // ---------------------------
    const mlData = {
      age: safeNumber(parsedJSON.patient.age),
      gender: parsedJSON.patient.gender || "",

      total_bilirubin: safeNumber(testMap.total_bilirubin),
      direct_bilirubin: safeNumber(testMap.direct_bilirubin),
      indirect_bilirubin: safeNumber(testMap.indirect_bilirubin),
      alkphos: safeNumber(testMap.alkphos),
      sgpt: safeNumber(testMap.sgpt),
      sgot: safeNumber(testMap.sgot),
      total_proteins: safeNumber(testMap.total_proteins),
      albumin: safeNumber(testMap.albumin),
      globulin: safeNumber(testMap.globulin),
      ag_ratio: safeNumber(testMap.ag_ratio),
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
