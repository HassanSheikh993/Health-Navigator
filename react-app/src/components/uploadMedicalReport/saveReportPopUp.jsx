
import { useState } from "react";
import "../../Styles/sendDoctorPopUp.css"
import { uploadMedicalReport } from "../../services/medicalReport";

export function SaveReportPopup({ isOpen, onClose,report }) {
     const [sendReport,setSendReport] = useState(false);
     const [message,setMessage] = useState("");
     

if (!isOpen) return null;

async function sendReportToDoctor(){
  setSendReport(true)
  const result = await uploadMedicalReport(report);
  console.log("kkkk ",result)
  if(result){
    setSendReport(false);
    setMessage(result.message);
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
          <button className="popup-confirm-btn" onClick={sendReportToDoctor}>
            Save Report
          </button>
        </div>
        <p>{message}</p>

{
    sendReport && <span className="loader"></span>
}

      </div>
    </div>
  );
}