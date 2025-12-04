import { useState } from "react";
import "../../Styles/sendDoctorPopUp.css";
import { saveMedicalReport } from "../../services/medicalReport";
import toast from "react-hot-toast"; // <-- Make sure you have react-hot-toast installed

export function SaveReportPopup({ isOpen, onClose, report, pdfFile, originalFile, structuredData }) {
  const [sendReport, setSendReport] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  async function sendReportToDoctor() {
    try {
      setSendReport(true);

      // optional cleanup for ```json ... ```
      const cleanReport = report ? report.replace(/```json|```/g, "").trim() : "";

     const result = await saveMedicalReport(pdfFile, originalFile, structuredData, report?.ml_result);

      console.log("✅ Saved report:", result);

      setSendReport(false);

      // Show toast notification
      toast.success(result.message || "Report saved successfully!", {
        duration: 4000,
        position: "top-center",
      });

      // Close popup automatically after success
      onClose();

    } catch (error) {
      console.error("❌ Error sending report:", error);
      setSendReport(false);
      setMessage(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-btn" onClick={onClose}>
          &times;
        </button>
        <h1 className="popup-title">Save Medical Report</h1>
        <p className="popup-message">
          Are you sure you want to save your medical report?
        </p>
        <div className="popup-buttons">
          <button className="popup-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-confirm-btn" onClick={sendReportToDoctor} disabled={sendReport}>
            {sendReport ? "Saving..." : "Save Report"}
          </button>
        </div>
        {message && <p>{message}</p>}
        {sendReport && <span className="loader"></span>}
      </div>
    </div>
  );
}
