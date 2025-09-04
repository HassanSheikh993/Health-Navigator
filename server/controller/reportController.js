import { Report } from "../model/reportModel.js";
import { SharedReport } from "../model/sharedReportModel.js";

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


export const displayAllReports = async(req,res)=>{
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
    patient_id:req.user.id,
    doctor_email:doctorEmail
  }))

  const result = await SharedReport.insertMany(sharedReports);
  res.status(201).json({message:`Report send to ${doctorEmail}`});
 }catch(err){
  console.log("Error in sendReportToDoctor function ",err);
    res.status(500).json({ message: "Error sending report to doctor", error: err.message });
 }
}