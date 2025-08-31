import express from "express";
import { allDoctors, searchDoctors } from "../controller/doctorController.js";

export const doctorRouter = express.Router();

doctorRouter.get("/doctors-list",allDoctors);
doctorRouter.get("/search-doctor",searchDoctors);

