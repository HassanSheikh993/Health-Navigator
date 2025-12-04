// routes/reportRouter.js
import express from "express";
import { auth } from "../middleWares/authMiddleware.js";
import { uploadMedicalReport } from "../middleWares/uploadMedicalReport.js";
import {
  uploadReport,
  displayReports,
  sendReportToDoctor,
  getAllReportsForDoctor,
  getReportStats,
  deleteUserReport,
  getUserReportsWithFeedback,
  saveMedicalReport,
  generatePdfController
} from "../controller/reportController.js";
import { saveMedicalReportMulter } from "../middleWares/saveReportsMiddleware.js";
export const reportRouter = express.Router();

// ✅ Upload & Auto Smart Report Generation
reportRouter.post("/upload-report", uploadMedicalReport.single("report"), uploadReport);

reportRouter.post(
  "/save-report",
  auth,
  saveMedicalReportMulter.any(),   // accept all form-data fields
  saveMedicalReport
);


// ✅ Standard routes
reportRouter.get("/allReports", auth, displayReports);
reportRouter.post("/sendReports", auth, sendReportToDoctor);
reportRouter.get("/getDoctorReports", auth, getAllReportsForDoctor);

reportRouter.get("/getReportStats", auth, getReportStats);

reportRouter.delete("/deleteUserReport", auth, deleteUserReport);
reportRouter.get("/getUserReportsWithFeedback", auth, getUserReportsWithFeedback);


reportRouter.post("/generate-pdf", generatePdfController);
