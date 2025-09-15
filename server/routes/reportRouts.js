import express from "express";
import { addDoctorReview, deleteUserReport, displayReports, doctorReviewHistory, getAllReportsForDoctor, getReportStats, getUserReportsWithFeedback, sendReportToDoctor, uploadReport } from "../controller/reportController.js";
import { auth } from "../middleWares/authMiddleware.js";
import { uploadMedicalReport } from "../middleWares/uploadMedicalReport.js";

export const reportRouter = express.Router();

reportRouter.post("/upload-report",auth, uploadMedicalReport.single("report"), uploadReport);
reportRouter.get("/allReports",auth,displayReports)
reportRouter.post("/sendReports",sendReportToDoctor)
reportRouter.get("/getDoctorReports",auth,getAllReportsForDoctor)
reportRouter.put("/addDoctorReview",auth,addDoctorReview)
reportRouter.get("/getReportStats",auth,getReportStats)

reportRouter.get("/doctorReviewHistory",auth,doctorReviewHistory)

reportRouter.delete("/deleteUserReport",auth,deleteUserReport);

reportRouter.get("/getUserReportsWithFeedback",getUserReportsWithFeedback)

