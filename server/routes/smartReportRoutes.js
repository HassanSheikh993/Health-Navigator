import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { generateSmartReport } from "../utils/smartReportGenerator.js";
import { structureMedicalReport } from "../utils/structureReport.js"; // optional

const smartReportRoutes = express.Router();

// ✅ Ensure uploads folder exists
const uploadFolder = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
  console.log("📁 Created uploads folder at:", uploadFolder);
}

// ✅ Custom Multer Storage (preserves original extension)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Smart Report Endpoint
smartReportRoutes.post("/smart-report", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("📄 Received file for Smart Report:", filePath);

    const report = await generateSmartReport(filePath);

    // Clean up uploaded file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("⚠️ Error deleting temp file:", err);
    });

    res.json({ success: true, report });
  } catch (error) {
    console.error("❌ Error generating smart report:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Structured Report Endpoint (Optional)
smartReportRoutes.post("/structure-report", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("📄 Received file for structuring:", filePath);

    const report = await structureMedicalReport(filePath);

    fs.unlink(filePath, (err) => {
      if (err) console.error("⚠️ Error deleting temp file:", err);
    });

    res.json({ success: true, report });
  } catch (error) {
    console.error("❌ Error structuring report:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default smartReportRoutes;
