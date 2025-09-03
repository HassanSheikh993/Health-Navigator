import express from "express";
import { uploadReport } from "../controller/reportController.js";
import { auth } from "../middleWares/authMiddleware.js";
import { uploadMedicalReport } from "../middleWares/uploadMedicalReport.js";

export const reportRouter = express.Router();

reportRouter.post("/upload-report", uploadMedicalReport.single("report"), uploadReport);


