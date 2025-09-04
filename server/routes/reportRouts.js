import express from "express";
import { displayAllReports, sendReportToDoctor, uploadReport } from "../controller/reportController.js";
import { auth } from "../middleWares/authMiddleware.js";
import { uploadMedicalReport } from "../middleWares/uploadMedicalReport.js";

export const reportRouter = express.Router();

reportRouter.post("/upload-report",auth, uploadMedicalReport.single("report"), uploadReport);
reportRouter.get("/allReports",displayAllReports)
reportRouter.post("/sendReports",sendReportToDoctor)

