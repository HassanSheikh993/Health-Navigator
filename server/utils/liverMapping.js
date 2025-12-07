// ---------------------------------------------------
// ✔ UNIVERSAL LFT Test Name Normalizer
// ---------------------------------------------------
export function normalizeTestName(name = "") {
  return String(name)
    .toLowerCase()
    .trim()

    // Remove units like (mg/dl), (u/l)
    .replace(/\([^)]*\)/g, "")

    // Replace + - : with space
    .replace(/[+\-:]/g, " ")

    // Convert / or \ to underscore
    .replace(/[\/\\]+/g, "_")

    // Replace all non-alphanumerics with underscore
    .replace(/[^a-z0-9]+/g, "_")

    // Collapse multiple underscores
    .replace(/_+/g, "_")

    // Remove leading/trailing underscores
    .replace(/^_+|_+$/g, "");
}

// ---------------------------------------------------
// ✔ UNIVERSAL LFT TEST NAME MAP (complete & global)
// ---------------------------------------------------
export const TEST_NAME_MAP = {
  // -------------------------------
  // BILIRUBIN
  // -------------------------------
  "serum_bilirubin_total": "total_bilirubin",
  "bilirubin_total": "total_bilirubin",
  "total_bilirubin": "total_bilirubin",
  "tbl": "total_bilirubin",

  "serum_bilirubin_direct": "direct_bilirubin",
  "bilirubin_direct": "direct_bilirubin",
  "direct_bilirubin": "direct_bilirubin",
  "dbl": "direct_bilirubin",

  "serum_bilirubin_indirect": "indirect_bilirubin",
  "bilirubin_indirect": "indirect_bilirubin",
  "indirect_bilirubin": "indirect_bilirubin",
  "ibl": "indirect_bilirubin",

  // -------------------------------
  // SGPT / ALT
  // -------------------------------
  "sgpt": "sgpt",
  "sgpt_alt": "sgpt",
  "alt": "sgpt",
  "alanine_transaminase": "sgpt",
  "alanine_aminotransferase": "sgpt",

  // -------------------------------
  // SGOT / AST
  // -------------------------------
  "sgot": "sgot",
  "sgot_ast": "sgot",
  "ast": "sgot",
  "aspartate_transaminase": "sgot",
  "aspartate_aminotransferase": "sgot",

  // -------------------------------
  // ALKALINE PHOSPHATASE
  // -------------------------------
  "serum_alkaline_phosphatase": "alkphos",
  "alkaline_phosphatase": "alkphos",
  "alkphos": "alkphos",
  "alp": "alkphos",

  // -------------------------------
  // TOTAL PROTEINS
  // -------------------------------
  "serum_protein": "total_proteins",
  "total_protein": "total_proteins",
  "total_proteins": "total_proteins",
  "tp": "total_proteins",

  // -------------------------------
  // ALBUMIN
  // -------------------------------
  "serum_albumin": "albumin",
  "albumin": "albumin",
  "alb": "albumin",

  // -------------------------------
  // GLOBULIN
  // -------------------------------
  "globulin": "globulin",
  "serum_globulin": "globulin",

  // -------------------------------
  // A/G Ratio (all variations)
  // -------------------------------
  "a_g_ratio": "ag_ratio",
  "a_g_r": "ag_ratio",
  "agr": "ag_ratio",
  "a_g": "ag_ratio",
  "a_gratio": "ag_ratio",
  "aig_ratio": "ag_ratio",
  "albumin_globulin_ratio": "ag_ratio",
  "albumin_to_globulin_ratio": "ag_ratio",
  "albumin_globulin_a_g_ratio": "ag_ratio",

  // -------------------------------
  // Safety fallback
  // -------------------------------
  "bilirubin": "total_bilirubin",
  "protein": "total_proteins",
  "albumin_globulin": "ag_ratio",
};
