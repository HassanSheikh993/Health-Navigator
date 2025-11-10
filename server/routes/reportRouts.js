// routes/reportRouter.js
import express from "express";
import { auth } from "../middleWares/authMiddleware.js";
import { uploadMedicalReport } from "../middleWares/uploadMedicalReport.js";
import {
  uploadReport,
  displayReports,
  sendReportToDoctor,
  getAllReportsForDoctor,
  addDoctorReview,
  getReportStats,
  doctorReviewHistory,
  deleteUserReport,
  getUserReportsWithFeedback,
} from "../controller/reportController.js";

export const reportRouter = express.Router();

// ✅ Upload & Auto Smart Report Generation
reportRouter.post("/upload-report", auth, uploadMedicalReport.single("report"), uploadReport);

// ✅ Standard routes
reportRouter.get("/allReports", auth, displayReports);
reportRouter.post("/sendReports", auth, sendReportToDoctor);
reportRouter.get("/getDoctorReports", auth, getAllReportsForDoctor);
reportRouter.put("/addDoctorReview", auth, addDoctorReview);
reportRouter.get("/getReportStats", auth, getReportStats);
reportRouter.get("/doctorReviewHistory", auth, doctorReviewHistory);
reportRouter.delete("/deleteUserReport", auth, deleteUserReport);
reportRouter.get("/getUserReportsWithFeedback", auth, getUserReportsWithFeedback);
