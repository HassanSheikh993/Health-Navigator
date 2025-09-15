import { Report } from "../model/reportModel.js";
import { SharedReport } from "../model/sharedReportModel.js";
import { User } from "../model/userModel.js";

export const uploadReport = async (req, res) => {
  try {
    console.log("REPORT: ",req.file.path)
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    console.log(req.user.id)

    const newReport = await Report.create({
      user: req.user.id, 
      // reportPath: req.file.path
      reportPath: req.file.relativePath,
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
   const{reports,doctor_id} = req.body;
  if(!reports || !doctor_id) return res.status(400).json({message:"Missing required fields"});

  const reportsID = Array.isArray(reports) ? reports : [reports];

  const sharedReports = reportsID.map((id)=>({
    report_id:id,
    // patient_id:req.user.id,
    patient_id:"68b85c1c45898537812426dd",
    doctor_id:doctor_id
  }))

  const result = await SharedReport.insertMany(sharedReports);
  res.status(201).json({message:`Report send`});
 }catch(err){
  console.log("Error in sendReportToDoctor function ",err);
    res.status(500).json({ message: "Error sending report to doctor", error: err.message });
 }
}

// This function is responsible for displaying reports to user, user saved reports
export const displayReports = async(req,res) => {
  try{
     const userId = req.user.id;
     const result = await Report.find({user:userId}).populate("user","name email picture");
     if(!result) return res.status(404).json({message:"Reports not found"});
     if (!result || result.length === 0) {
  return res.status(200).json([]);
}
      res.status(200).json(result);
  }catch(err){
    console.log("Error in displayAllReports function ",err);
    res.status(500).json({ message: "Error displaying report", error: err.message });
  }
}

export const getAllReportsForDoctor = async(req,res) => {
  try{
   
  const doctor_id = req.user.id;

   const result = await SharedReport.find({doctor_id:doctor_id})
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

export const addDoctorReview = async(req,res) => {
try{
    const {doctorReviewedText,patient_id,report_id} = req.body;
  if(!doctorReviewedText || !patient_id || !report_id) return res.status(400).json({message:"Incomplete Data"});


  const result = await SharedReport.updateOne(
    {doctor_id:req.user.id,patient_id:patient_id,report_id:report_id},
    {$set:{
      doctor_review:doctorReviewedText,
      viewedByDoctor:true,
      doctor_reviewedAt: new Date() 
    }});

       if (result.modifiedCount > 0) {
      return res.status(201).json({ message: "Review Sent" });
    } else {
      return res.status(404).json({ message: "No matching report found" });
    }
      
}catch(err){
  console.log("Error in addDoctorReview function ",err);
  res.status(500).json({ message: "Error addDoctorReview", error: err.message });
}
    
}


export const getReportStats = async (req, res) => {
  try {
    const doctor_id = req.user.id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const todayCount = await SharedReport.countDocuments({
      doctor_id: doctor_id,
      createdAt: { $gte: startOfToday }
    });

    const monthCount = await SharedReport.countDocuments({
      doctor_id: doctor_id,
      createdAt: { $gte: startOfMonth }
    });

    res.status(200).json({ today: todayCount, month: monthCount });
  } catch (err) {
    console.log("Error in getReportStats", err);
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
};


export const doctorReviewHistory = async(req,res) => {
  try{
    const doctor_id= req.user.id;
    const result = await SharedReport.find({
      $and:[
        {doctor_id:doctor_id},
        {viewedByDoctor:true}
      ]
    }).populate("patient_id","_id name email picture")
      .populate("report_id","_id reportPath")

    
  if (!result || result.length === 0) {
  return res.status(200).json([]);
}

res.status(200).json(result);


  }catch(err){
    console.log("Error in doctorReviewHistory function ",err);
    res.status(500).json({ message: "Error doctorReviewHistory", error: err.message });

  }
}


export const deleteUserReport = async(req,res) => {
  try{
    const {ids} = req.body;
    if(!ids) return res.status(400).json({message:"Report Id is not send"});

    const result =    await Report.deleteMany({ _id: { $in: ids } });
    if(result.deletedCount <= 0) return res.status(404).json({message:"No Report Deleted"});

   res.status(200).json({ message: "Report Deleted" });


  }catch(err){
 console.log("Error in deleteUserReport function ",err);
    res.status(500).json({ message: "Error deleteUserReport", error: err.message });
  }
}

export const getUserReportsWithFeedback = async(req,res) =>{
 try{
   const userId = "68b85c1c45898537812426dd";

   const result = await SharedReport.find({patient_id:userId})
   .populate("doctor_id","name email picture")
   .populate("report_id","_id reportPath");

  if (!result || result.length === 0) {
  return res.status(200).json([]);
}

res.status(200).json(result);

 }catch(err){
  console.log("Error in getUserReportsWithFeedback function ",err);
    res.status(500).json({ message: "Error getUserReportsWithFeedback", error: err.message });
 }

}