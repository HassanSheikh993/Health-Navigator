
import { useState } from "react";
import "../../Styles/sendDoctorPopUp.css"

export function SendReportPopup({ isOpen, onClose,doctor }) {
     const [sendReport,setSendReport] = useState(false);
      const doctorId = doctor;
      console.log(doctorId);
      
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
        <h1 className="popup-title">Send Medical Report</h1>
        <p className="popup-message">
          Are you sure you want to send your medical report to this doctor? 
          This will share your health information with the selected medical professional.
        </p>
        <div className="popup-buttons">
          <button className="popup-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-confirm-btn" onClick={sendReportToDoctor}>
            Send Report
          </button>
        </div>

{
    sendReport && <span className="loader"></span>
}

      </div>
    </div>
  );
}