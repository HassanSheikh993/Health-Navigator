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

    // 🧹 Clean up Markdown
    const smartReport = rawReport.replace(/\\n/g, "\n").trim();

    console.log("✅ Smart report generated successfully");
    return { success: true, report: smartReport };
  } catch (error) {
    console.error("❌ Error generating Smart Report:", error.message);
    return { success: false, report: `Error: ${error.message}` };
  }
};
