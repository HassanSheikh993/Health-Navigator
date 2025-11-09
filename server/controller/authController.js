import { User } from "../model/userModel.js";
import { findUserByEmail } from "../services/userService.js";
import tempUsers from "../utils/tempUsers.js";
import { sendEmail } from "../utils/emailService.js";
import otpStore from "../utils/otpStore.js";
import { generateToken } from "../config/generateToken.js";

export const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({message:"Incomplete Data",status:false})

   const userExist = await findUserByEmail(email);
   if(userExist === false) return res.status(404).json({message:"user not found",success: false})

   const isMatch = await userExist.matchPassword(password);
   if(!isMatch) return res.status(401).json({message:"Incorrect Password",success: false});

const token = generateToken(userExist._id);

res.cookie("token", token, {
  httpOnly: true,
  secure: false, 
  sameSite: "lax", 
  maxAge: 30 * 24 * 60 * 60 * 1000, 
});


  res.json({ success: true, message: "Login successful",userEmail:userExist.userEmail});

}

export const registration = async(req,res)=>{
    try{
        const {name,email,password,role} = req.body;
    if(!name || !email || !password || !role) return res.status(400).send("Incomplete data");

    const userExist = await findUserByEmail(email);
    if(userExist){
        return res.status(400).json({message:"User already exist"})
    }

     const verificationCode = Math.floor(100000 + Math.random() * 900000);

     tempUsers[email] = { name, email, password, role, verificationCode };

    await sendEmail(email, verificationCode);
    res.status(200).json({ message: "Verification code sent to email",status: true });

  

    }catch(err){
        return res.status(500).send(`Error in registration function ${err}`)
    }
}

export const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const tempUser = tempUsers[email];

    if (!tempUser || tempUser.verificationCode != code) {
      return res.status(400).json({ message: "Invalid or expired code",success: true });
    }

    const newUser = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      isVerified: true,
    });

    delete tempUsers[email];

    res.status(201).json({ message: "Email verified, account created", user: newUser });
  } catch (err) {
    console.log("error in verifyEmailCode ",err);
    res.status(500).json({ message: `Error verifying email: ${err.message}` });
  }
};

export const forgetPassword = async (req,res) => {
try{
    const {email} = req.body;
  if(!email) return res.status(400).json({message:"email required"});

  const userExist = await findUserByEmail(email);
  if(userExist === false) return res.status(404).json({message:"user not found"})

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      code: verificationCode.toString(),
      expiresAt: Date.now() + 5 * 60 * 1000, 
    };

    await sendEmail(email, verificationCode);

    res.status(200).json({ message: "OTP sent to email" });
}catch(err){
  console.log("error in forgetPassword ", err);
  res.status(500).json({ message: "Error in forgetPassword", error: error.message });
}

}

export const verifyForgetPasswordOTP = async(req,res)=>{
  try{
    const {email,code} = req.body;
  if(!email || !code) res.status(400).json({ message: "Invalid or expired code" });

  const userOTP = otpStore[email];

  if(!userOTP || userOTP.code != code) return res.status(400).json({ message: "Invalid or no code" });

    if (Date.now() > userOTP.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

   delete otpStore[email];
  res.status(200).json({ message: "OTP verified" });
  }catch(err){
    console.log("error in verifyForgetPasswordOTP ",err);
    res.status(500).json({ message: `Error verifying email: ${err.message}` }); 
  }
}

export const updatePasswordController  = async(req,res)=>{
  try{
   const {email,password} = req.body;
   if(!email || !password) return res.status(400).json({message: "Email and password required" });
   
   const userExist = await findUserByEmail(email);
   
   if(!userExist) return res.status(404).json({message:"user not exists"});
   
    User.password = password;
    await User.save();

    res.status(200).json({ message: "Password updated successfully" });


  }catch(err){
    console.log("error in updatePasswordController ",err);
      res.status(500).json({ message: "Error updating password", error: error.message });
  }
}

export const logoutUser = (req,res)=>{
 res.clearCookie('token', { path: '/' });
  res.status(200).json({ message: 'Logged out successfully', status: true });
}
