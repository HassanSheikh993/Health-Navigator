import { Report } from "../model/reportModel.js";
import path from "path";
import { structureMedicalReport } from "../utils/structureReport.js";
import { generateSmartReport } from "../utils/smartReportGenerator.js";

export const uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const relativePath = req.file.relativePath;

    console.log("📄 Uploaded file:", filePath);
    console.log("👤 User ID:", req.user.id);

    // Step 1 — Save basic report entry in DB
    const newReport = await Report.create({
      user: req.user.id,
      reportPath: relativePath,
    });

    // Step 2 — Generate Smart Report (internally calls OCR + structuring)
  

    const smartReport = await generateSmartReport(filePath);


    console.log("💬 Smart report generated.");

    // Step 3 — Save Smart Report in DB
    newReport.smartReport = smartReport.report;
    await newReport.save();

    res.status(201).json({
      message: "Report uploaded and processed successfully",
      report: newReport,
      smartReport: smartReport.report,
    });
  } catch (err) {
    console.error("❌ Error in uploadReport:", err);
    res.status(500).json({
      message: "Error uploading or processing report",
      error: err.message,
    });
  }
};

// This function is responsible for displaying one single report


export const getSingleReport = async (req, res) => {
  try {
    const reportID = "68b85b2545898537812426bb";
    const response = await Report.findById(reportID).populate("user", "name email");
    if (!response) return res.status(404).send({ message: "Reports not found" })
    res.status(200).json(response);
  } catch (err) {
    console.log("Error in displayAllReports function ", err);
    res.status(500).json({ message: "Error displaying report", error: err.message });
  }
}

export const sendReportToDoctor = async (req, res) => {
  try {
    const { reports, doctor_id } = req.body;
    if (!reports || !doctor_id) return res.status(400).json({ message: "Missing required fields" });

    const reportsID = Array.isArray(reports) ? reports : [reports];

    const sharedReports = reportsID.map((id) => ({
      report_id: id,
      patient_id: req.user.id,

      doctor_id: doctor_id
    }))

    const result = await SharedReport.insertMany(sharedReports);
    res.status(201).json({ message: `Report send` });
  } catch (err) {
    console.log("Error in sendReportToDoctor function ", err);
    res.status(500).json({ message: "Error sending report to doctor", error: err.message });
  }
}

// This function is responsible for displaying reports to user, user saved reports
export const displayReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Report.find({ user: userId }).populate("user", "name email picture");
    if (!result) return res.status(404).json({ message: "Reports not found" });
    if (!result || result.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(result);
  } catch (err) {
    console.log("Error in displayAllReports function ", err);
    res.status(500).json({ message: "Error displaying report", error: err.message });
  }
}

export const getAllReportsForDoctor = async (req, res) => {
  try {

    const doctor_id = req.user.id;

    const result = await SharedReport.find({ doctor_id: doctor_id })
      .populate("patient_id", "_id name email picture")
      .populate("report_id", "reportPath simplifiedReport");

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No reports" });
    }

    res.status(200).json(result);

  } catch (err) {
    console.log("Error in getAllReportsForDoctor function ", err);
    res.status(500).json({ message: "Error getAllReportsForDoctor", error: err.message });
  }
}

export const addDoctorReview = async (req, res) => {
  try {
    const { doctorReviewedText, patient_id, report_id } = req.body;
    if (!doctorReviewedText || !patient_id || !report_id) return res.status(400).json({ message: "Incomplete Data" });


    const result = await SharedReport.updateOne(
      { doctor_id: req.user.id, patient_id: patient_id, report_id: report_id },
      {
        $set: {
          doctor_review: doctorReviewedText,
          viewedByDoctor: true,
          doctor_reviewedAt: new Date()
        }
      });

    if (result.modifiedCount > 0) {
      return res.status(201).json({ message: "Review Sent" });
    } else {
      return res.status(404).json({ message: "No matching report found" });
    }

  } catch (err) {
    console.log("Error in addDoctorReview function ", err);
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


export const doctorReviewHistory = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const result = await SharedReport.find({
      $and: [
        { doctor_id: doctor_id },
        { viewedByDoctor: true }
      ]
    }).populate("patient_id", "_id name email picture")
      .populate("report_id", "_id reportPath")


    if (!result || result.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(result);


  } catch (err) {
    console.log("Error in doctorReviewHistory function ", err);
    res.status(500).json({ message: "Error doctorReviewHistory", error: err.message });

  }
}


export const deleteUserReport = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids) return res.status(400).json({ message: "Report Id is not send" });

    const result = await Report.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount <= 0) return res.status(404).json({ message: "No Report Deleted" });

    res.status(200).json({ message: "Report Deleted" });


  } catch (err) {
    console.log("Error in deleteUserReport function ", err);
    res.status(500).json({ message: "Error deleteUserReport", error: err.message });
  }
}

export const getUserReportsWithFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId)

    const result = await SharedReport.find({ patient_id: userId })
      .populate("doctor_id", "name email picture")
      .populate("report_id", "_id reportPath");

    console.log(result);
    if (!result || result.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(result);

  } catch (err) {
    console.log("Error in getUserReportsWithFeedback function ", err);
    res.status(500).json({ message: "Error getUserReportsWithFeedback", error: err.message });
  }

}