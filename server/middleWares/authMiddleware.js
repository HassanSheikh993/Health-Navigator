import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Access Denied. Need to login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const validUser = await User.findById(decoded.id).select("-password");
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = validUser; 
    next();
  } catch (err) {
    console.log("Error in auth middleware: ", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
