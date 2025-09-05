import { Report } from "../model/reportModel.js";
import { SharedReport } from "../model/sharedReportModel.js";
import { User } from "../model/userModel.js";

export const uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    console.log(req.user.id)

    const newReport = await Report.create({
      user: req.user.id, 
      reportPath: req.file.path
    });

    res.status(201).json({ message: "Report uploaded successfully", report: newReport });
  } catch (err) {
    console.error("Error uploading report:", err);
    res.status(500).json({ message: "Error uploading report", error: err.message });
  }
};


// This function is responsible for displaying one single report
export const getSingleReport = async(req,res)=>{
  try{
    const reportID = "68b85b2545898537812426bb";
  const response = await Report.findById(reportID).populate("user", "name email");
  if(!response) return res.status(404).send({message:"Reports not found"})
  res.status(200).json(response);
  }catch(err){
    console.log("Error in displayAllReports function ",err);
    res.status(500).json({ message: "Error displaying report", error: err.message });
  }
}

export const sendReportToDoctor = async(req,res)=>{
 try{
   const{reports,doctorEmail} = req.body;
  if(!reports || !doctorEmail) return res.status(400).json({message:"Missing required fields"});

  const reportsID = Array.isArray(reports) ? reports : [reports];

  const sharedReports = reportsID.map((id)=>({
    report_id:id,
    // patient_id:req.user.id,
    patient_id:"68b5854f3356b9543c2887a0",
    doctor_email:doctorEmail
  }))

  const result = await SharedReport.insertMany(sharedReports);
  res.status(201).json({message:`Report send to ${doctorEmail}`});
 }catch(err){
  console.log("Error in sendReportToDoctor function ",err);
    res.status(500).json({ message: "Error sending report to doctor", error: err.message });
 }
}

// This function is responsible for displaying reports to user, user saved reports
export const displayReports = async(req,res) => {
  try{
     const userId = "68b5854f3356b9543c2887a0";
     const result = await Report.find({user:userId}).populate("user","name email");
     if(!result) return res.status(404).json({message:"Reports not found"});
     if (!result || result.length === 0) {
  return res.status(404).json({ message: "No reports" });
}
      res.status(200).json(result);
  }catch(err){
    console.log("Error in displayAllReports function ",err);
    res.status(500).json({ message: "Error displaying report", error: err.message });
  }
}

export const getAllReportsForDoctor = async(req,res) => {
  try{
   const doctor = await User.findById(req.user.id);
   const doctor_email = doctor.email;
  //  if(!doctorEmail) return res.status(400).json({message:"Doctor Email Missing"});

   const result = await SharedReport.find({doctor_email:doctor_email})
                 .populate("patient_id","_id name email picture")
                 .populate("report_id","reportPath simplifiedReport");

  if (!result || result.length === 0) {
  return res.status(404).json({ message: "No reports" });
}

  res.status(200).json(result);               

  }catch(err){
console.log("Error in getAllReportsForDoctor function ",err);
    res.status(500).json({ message: "Error getAllReportsForDoctor", error: err.message });
  }
}