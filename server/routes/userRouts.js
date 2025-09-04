import express from "express";
import { loginUser, registration,verifyEmailCode,forgetPassword,verifyForgetPasswordOTP, updatePasswordController, logoutUser } from "../controller/authController.js";

import { loginUserData, updateProfile } from "../controller/userController.js";
import { upload } from "../middleWares/multerMiddleware.js";
// import { auth } from "../middleWares/authMiddleware.js";
import { auth } from "../middleWares/authMiddleware.js";

export const router = express.Router();

router.post("/loginVerification",loginUser);
router.post("/registration",registration);
router.post("/verifyEmail",verifyEmailCode)

router.post("/forgetPassword", forgetPassword);
router.post("/verify-OTP-forget-password", verifyForgetPasswordOTP);
router.post("/update-password",updatePasswordController)

router.put("/update-profile",upload.single("file"),updateProfile)

router.get("/loginUserData",auth,loginUserData)

router.get("/logout-user",logoutUser);