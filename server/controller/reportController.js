import { Report } from "../model/reportModel.js";
import path from "path";
import { structureReport } from "../utils/structureReport.js";
import { SharedReport } from "../model/sharedReportModel.js";
import { generateSmartReport } from "../utils/smartReportGenerator.js";
import { generateMedicalPdf } from "../utils/generatePdf.js";
import { buildReportHtml } from "../templates/reportTemplate.js";
import MarkdownIt from "markdown-it";
import fs from "fs";


export const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const filePath = req.file.path;
    console.log("📄 Uploaded file:", filePath);

    // -------------------------------------------------------
    // STEP 1 — Run OCR + LLM structuring + ML prediction
    // -------------------------------------------------------
    console.log("⚙️ Step 1: Structuring medical report...");

    const structured = await structureReport(filePath);

       if (!structured.success) {
      return res.status(400).json({
        success: false,
        message: structured.error   // 👈 send real LFT error
      });
    }

    console.log("✅ Step 1 completed. Structured JSON ready.");

    // -------------------------------------------------------
    // STEP 2 — Generate Smart Report using AI + ML result
    // -------------------------------------------------------
    console.log("⚙️ Step 2: Generating Smart Report...");

    const smart = await generateSmartReport({
      // Send ALL needed fields to the smart report generator
      structuredJSON: structured.structured,     // parsed JSON
      structuredText: structured.structuredText, // raw structured JSON text (string)
      ml_result: structured.ml_result            // ML output
    });

    if (!smart.success) {
      throw new Error(`Smart report generation failed: ${smart.error}`);
    }

    console.log("✅ Smart Report generated successfully.");

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------
    res.status(201).json({
      success: true,
      message: "Report uploaded and processed successfully",

      structuredData: structured.structured,         // clean parsed JSON
      structuredDataRaw: structured.structuredText,  // raw string JSON
      ml_result: structured.ml_result,               // ML classification
      smartReport: smart.report                      // final smart report
    });

  } catch (err) {
    console.error("❌ Error in uploadReport:", err);
    res.status(500).json({
      success: false,
      message: "Error uploading or processing report",
      error: err.message,
    });
  }
};



// export const saveMedicalReport = async (req, res) => {
//   try {
//     if (!req.files?.originalReport || !req.files?.aiReportPDF) {
//       return res.status(400).json({
//         message: "Both original report and AI report are required"
//       });
//     }

//     const originalFile = req.files.originalReport[0];
//     const aiReportFile = req.files.aiReportPDF[0];
//     const structuredText = req.body.keyValues;   // FIXED
//     const ml_result = req.body.ml_result;
//     console.log(structuredText);
//     let testsArray = [];
//     try {
//       testsArray = JSON.parse(structuredText);


//     } catch (err) {
//       console.warn("⚠️ Could not parse structured text as JSON:", err.message);
//       console.log("💡 Cleaned text snippet for debugging:\n", cleanText.slice(0, 300));
//     }

//     console.log("🧪 Extracted tests:", testsArray);


//     console.log("reportPath: ", originalFile.relativePath)
//     console.log("aiReportPath: ", aiReportFile.relativePath)


//     // Save to database
//     const newReport = await Report.create({
//       user: req.user.id,
//       reportPath: originalFile.relativePath, // Store original report path
//       smartReport: aiReportFile.relativePath, // Store AI report path
//       keyValues: testsArray,
//       ml_result: ml_result
//     });


//     res.status(201).json({
//       success: true,
//       message: "Reports saved successfully",
//       report: newReport,
//     });
//   } catch (err) {
//     console.error("Error saving report:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error saving reports",
//       error: err.message,
//     });
//   }
// };


export const saveMedicalReport = async (req, res) => {
  try {
    const { markdownHtml, keyValues, ml_result } = req.body;

    if (!markdownHtml || typeof markdownHtml !== "string") {
      return res.status(400).json({ message: "Invalid HTML content" });
    }

    // ----------------------------------------
    // Build final HTML for PDF
    // ----------------------------------------
    const fullHtml = buildReportHtml(markdownHtml);

    // Generate PDF using Puppeteer
    const pdfBuffer = await generateMedicalPdf(fullHtml);

    // ----------------------------------------
    // SAVE AI REPORT (PDF) inside: public/aiReports
    // ----------------------------------------
    const pdfName = `ai-report-${Date.now()}.pdf`;
    const folderPath = path.join("public", "aiReports");

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const pdfPath = path.join(folderPath, pdfName);
    fs.writeFileSync(pdfPath, pdfBuffer);

    // DB value for AI report
    const smartReportRel = `aiReports/${pdfName}`;

    // ----------------------------------------
    // ORIGINAL REPORT (uploaded by user)
    // MULTER ALREADY STORES IN /public/originalReports
    // ----------------------------------------
    const originalFile = req.files?.find(f => f.fieldname === "originalReport");

    let originalReportRel = "";
    if (originalFile) {
      // originalFile.path = "D:/Haseeb Disk/Health-Navigator/server/public/originalReports/xxxx.png"
      // Convert backslashes to forward slashes
      const cleaned = originalFile.path.replace(/\\/g, "/");
      // Remove the "public/" prefix to get the relative URL path
      originalReportRel = cleaned.replace(/^.*[/\\]public[/\\]/, "");
    }

    // ----------------------------------------
    // SAVE TO DATABASE
    // ----------------------------------------
    const newReport = await Report.create({
      user: req.user.id,
      reportPath: originalReportRel, // "originalReports/xxx.png"
      smartReport: smartReportRel,   // "aiReports/xxx.pdf"
      keyValues: JSON.parse(keyValues),
      ml_result,
    });

    // ----------------------------------------
    // RESPONSE
    // ----------------------------------------
    res.status(201).json({
      success: true,
      message: "Report saved successfully",
      pdfUrl: "/" + smartReportRel,
      report: newReport,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error generating PDF",
      error: err.message,
    });
  }
};

export const generatePdfController = async (req, res) => {
  try {
    const markdownHtml = req.body.markdownHtml;

    if (!markdownHtml || typeof markdownHtml !== "string") {
      return res.status(400).json({ message: "Invalid HTML content" });
    }

    const fullHtml = buildReportHtml(markdownHtml);

    const pdfBuffer = await generateMedicalPdf(fullHtml);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=medical-report.pdf",
    });

    return res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "PDF generation failed", error: err.message });
  }
};

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
      .populate("doctor_id", "_id email")
      .populate("report_id", "reportPath smartReport");

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No reports" });
    }

    res.status(200).json(result);

  } catch (err) {
    console.log("Error in getAllReportsForDoctor function ", err);
    res.status(500).json({ message: "Error getAllReportsForDoctor", error: err.message });
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
