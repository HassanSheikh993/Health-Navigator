import { Report } from "../model/reportModel.js";

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
