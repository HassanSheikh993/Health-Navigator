import express from "express";
import { loginUser, registration,verifyEmailCode,forgetPassword,verifyForgetPasswordOTP, updatePasswordController } from "../controller/authController.js";

export const router = express.Router();

router.post("/loginVerification",loginUser);
router.post("/registration",registration);
router.post("/verifyEmail",verifyEmailCode)

router.post("/forgetPassword", forgetPassword);
router.post("/verify-OTP-forget-password", verifyForgetPasswordOTP);
router.post("/update-password",updatePasswordController)