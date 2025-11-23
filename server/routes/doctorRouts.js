import express from "express";
import { allDoctors, searchDoctors, rateDoctorFeedback, doctorsWithRatings, doctorReviewHistory, addDoctorReview } from "../controller/doctorController.js";
import { auth } from "../middleWares/authMiddleware.js";

export const doctorRouter = express.Router();

doctorRouter.get("/doctors-list",allDoctors);
doctorRouter.get("/search-doctor",searchDoctors);
doctorRouter.post("/rate/:sharedReportId", auth, rateDoctorFeedback);
doctorRouter.get("/doctors-with-ratings", doctorsWithRatings);
doctorRouter.get("/doctorReviewHistory", auth, doctorReviewHistory);
doctorRouter.put("/addDoctorReview", auth, addDoctorReview);


