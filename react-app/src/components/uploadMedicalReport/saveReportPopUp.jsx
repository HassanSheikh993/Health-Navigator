
import { useState } from "react";
import "../../Styles/sendDoctorPopUp.css"

export function SaveReportPopup({ isOpen, onClose }) {
     const [sendReport,setSendReport] = useState(false);

if (!isOpen) return null;

function sendReportToDoctor(){
    setSendReport(true)
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
          <button className="popup-confirm-btn" onClick={sendReportToDoctor}>
            Save Report
          </button>
        </div>

{
    sendReport && <span className="loader"></span>
}

      </div>
    </div>
  );
}