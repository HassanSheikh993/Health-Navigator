// smartReportGenerator.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const generateSmartReport = async (structuredText) => {
  try {
    console.log("🩺 Generating final smart report...");

    const reportResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: `You are a medical AI assistant. 
Your output MUST be clean, professional Markdown ONLY.
Strict rules:
- NO introductory text (no “Here is your report”, “Below is”, etc.).
- NO extra comments, NO explanations.
- NO JSON, NO code blocks.
- DO NOT include placeholders like “N/A” unless truly needed.
- Write fully polished medical language.
- Follow the EXACT structure below.

REQUIRED STRUCTURE:

# Patient Profile
(Name, age, gender pulled from structured data)

# Summary of Results
(A concise medical summary of the overall report)

# Detailed Test Explanations
(Each test explained medically: what it means, what high/low indicates, and the patient’s results)

# Overall Interpretation
(A medical interpretation of all results combined)

# Recommendations
(Clear health guidance, lifestyle advice, and next steps)

# Disclaimer
(A short professional medical disclaimer)

Generate ONLY this structured Markdown.`,
          },
          {
            role: "user",
            content: `Use this structured medical JSON data to generate the Smart Health Report:

${structuredText}`,
          },
        ],
      }),
    });

    const finalResult = await reportResponse.json();
    const rawReport = finalResult?.choices?.[0]?.message?.content || "No report generated.";

    const smartReport = rawReport.replace(/\\n/g, "\n").trim();

    console.log("✅ Smart report generated successfully");
    console.log(smartReport);
    return { success: true, report: smartReport };

  } catch (error) {
    console.error("❌ Error generating Smart Report:", error.message);
    return { success: false, report: `Error: ${error.message}` };
  }
};
