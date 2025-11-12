// middleWares/uploadMedicalReport.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportFolder = path.join(__dirname, "..", "public", "medicalReports");
if (!fs.existsSync(reportFolder)) {
  fs.mkdirSync(reportFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, reportFolder),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    file.relativePath = `medicalReports/${uniqueName}`; 
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) return cb(null, true);
  cb(new Error("Only PDF, JPG, and PNG files are allowed!"));
};

export const uploadMedicalReport = multer({ storage, fileFilter });
