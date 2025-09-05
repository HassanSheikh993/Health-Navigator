import express from "express";
import { displayReports, getAllReportsForDoctor, sendReportToDoctor, uploadReport } from "../controller/reportController.js";
import { auth } from "../middleWares/authMiddleware.js";
import { uploadMedicalReport } from "../middleWares/uploadMedicalReport.js";

export const reportRouter = express.Router();

reportRouter.post("/upload-report",auth, uploadMedicalReport.single("report"), uploadReport);
reportRouter.get("/allReports",displayReports)
reportRouter.post("/sendReports",sendReportToDoctor)
reportRouter.get("/getDoctorReports",getAllReportsForDoctor)

