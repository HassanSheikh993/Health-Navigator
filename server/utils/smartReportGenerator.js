// smartReportGenerator.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const generateSmartReport = async ({ structuredJSON, structuredText, ml_result }) => {
  try {
    console.log("🩺 Generating final smart report...");

    // Handle variations (in case raw text or JSON is missing)
    const safeStructuredText =
      structuredText ||
      JSON.stringify(structuredJSON, null, 2);

    const safeML =
      typeof ml_result === "object"
        ? JSON.stringify(ml_result, null, 2)
        : String(ml_result ?? "");

    const reportResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: `You are a medical AI assistant. 
Your output MUST be clean, professional Markdown ONLY.
Strict rules:
- NO introductory text (no “Here is your report”, “Below is”, etc.).
- NO extra comments, NO explanations.
- NO JSON, NO code blocks.
- DO NOT include placeholders like “N/A” unless truly needed.
- Write fully polished medical language.
- Follow the EXACT structure below.

When generating the report, you MUST incorporate the ML Result (Normal or Abnormal):
- If the ML Result is Normal → Indicate that the predictive model assesses the profile as within normal limits.
- If the ML Result is Abnormal → Clearly note that the predictive model identifies an abnormal pattern requiring clinical attention.

REQUIRED STRUCTURE:

# Patient Profile
(Name, age, gender pulled from structured data)

# Summary of Results
(Include a summary of the report and mention the ML Result status with a clear flag)

# Detailed Test Explanations
(Each test explained medically: what it means, what high/low indicates, and the patient’s results)

# Overall Interpretation
(Provide a medical interpretation combining all results and referencing the ML Result flag)

# Recommendations
(Health guidance, lifestyle advice, and next steps based on both test data and ML Result)

# Disclaimer
(A short professional medical disclaimer)

Generate ONLY this structured Markdown.
`,
          },
          {
            role: "user",
            content: `Use this structured medical JSON data to generate the Smart Health Report:

Structured Data:
${safeStructuredText}

ML Result:
${safeML}`,
          },
        ],
      }),
    });

    const finalResult = await reportResponse.json();

    // Universal extraction to cover ALL OpenRouter model formats
    let smartReport =
      finalResult?.choices?.[0]?.message?.content ||
      finalResult?.output_text ||
      finalResult?.output?.[0]?.content ||
      finalResult?.message ||
      "No report generated.";

    smartReport = smartReport.replace(/\\n/g, "\n").trim();
    if (!smartReport || smartReport === "No report generated.") {
      console.log("❌ LLM did not return a valid report.");
      return {
        success: false,
        error: "Model returned no content"
      };
    }
    console.log("✅ Smart report generated successfully");
    console.log(smartReport);
    return { success: true, report: smartReport };

  } catch (error) {
    console.error("❌ Error generating Smart Report:", error.message);
    return { success: false, report: `Error: ${error.message}` };
  }
};
