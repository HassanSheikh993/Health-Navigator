import express from "express";
import { addDoctorReview, displayReports, getAllReportsForDoctor, getReportStats, sendReportToDoctor, uploadReport } from "../controller/reportController.js";
import { auth } from "../middleWares/authMiddleware.js";
import { uploadMedicalReport } from "../middleWares/uploadMedicalReport.js";

export const reportRouter = express.Router();

reportRouter.post("/upload-report",auth, uploadMedicalReport.single("report"), uploadReport);
reportRouter.get("/allReports",displayReports)
reportRouter.post("/sendReports",sendReportToDoctor)
reportRouter.get("/getDoctorReports",auth,getAllReportsForDoctor)
reportRouter.put("/addDoctorReview",auth,addDoctorReview)
reportRouter.get("/getReportStats",auth,getReportStats)

