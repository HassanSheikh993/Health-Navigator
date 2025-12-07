// utils/isLiverReport.js

const LIVER_KEYWORDS = [
  "bilirubin",
  "total bilirubin",
  "direct bilirubin",
  "indirect bilirubin",
  "sgpt",
  "alt",
  "sgot",
  "ast",
  "alkaline phosphatase",
  "alk phosphatase",
  "alkp",
  "alp",
  "lft",
  "liver function test",
  "liver profile",
  "total protein",
  "serum protein",
  "albumin",
  "globulin",
  "a/g ratio",
  "ag ratio"
];

/**
 * Detect whether the extracted OCR text is a Liver (LFT) report.
 * Returns true if reliable, false otherwise.
 */
export function isLiverReport(text = "") {
  if (!text || typeof text !== "string") return false;

  const lower = text.toLowerCase().replace(/\s+/g, " ");

  let matches = 0;
  for (const key of LIVER_KEYWORDS) {
    if (lower.includes(key)) matches++;
  }

  // Require at least 2 strong matches to avoid false positives
  return matches >= 2;
}
