import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create folders
const originalReportsFolder = path.join(__dirname, "..", "public", "originalReports");
const aiReportsFolder = path.join(__dirname, "..", "public", "aiReports");

[originalReportsFolder, aiReportsFolder].forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "originalReport") {
      cb(null, originalReportsFolder);
    } else if (file.fieldname === "aiReportPDF") {
      cb(null, aiReportsFolder);
    } else {
      cb(new Error("Invalid field name"), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    
    if (file.fieldname === "originalReport") {
      file.relativePath = `originalReports/${uniqueName}`;
    } else if (file.fieldname === "aiReportPDF") {
      file.relativePath = `aiReports/${uniqueName}`;
    }
    
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  extname ? cb(null, true) : cb(new Error("Only PDF, JPG, and PNG files allowed!"));
};

export const saveMedicalReportMulter = multer({ storage, fileFilter });