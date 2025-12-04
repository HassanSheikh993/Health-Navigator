import { useState } from "react";
import "../../Styles/sendDoctorPopUp.css";
import { saveMedicalReport } from "../../services/medicalReport";
import toast from "react-hot-toast";

export function SaveReportPopup({
  isOpen,
  onClose,
  reportHtml,
  originalFile,
  structuredData,
  ml_result
}) {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  async function handleSaveReport() {
    try {
      setLoading(true);

      const result = await saveMedicalReport(
        reportHtml,
        originalFile,
        structuredData,
        ml_result
      );

      toast.success(result.message || "Report saved successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
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
          <button
            className="popup-confirm-btn"
            onClick={handleSaveReport}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Report"}
          </button>
        </div>

        {message && <p>{message}</p>}
        {loading && <span className="loader"></span>}
      </div>
    </div>
  );
}
