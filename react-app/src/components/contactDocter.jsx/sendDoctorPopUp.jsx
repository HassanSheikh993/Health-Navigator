
import { useState,useEffect } from "react";
import "../../Styles/sendDoctorPopUp.css"
import { sendReportToDoctor } from "../../services/medicalReport";

export function SendReportPopup({ isOpen, onClose,doctor,selectedReports }) {
     const [sendReport,setSendReport] = useState(false);
     const [message,setMessage] = useState("");
      const doctorId = doctor;
      console.log(doctorId);
      
  useEffect(() => {
    if (isOpen) {
      setMessage("");
      setSendReport(false);
    }
  }, [isOpen]);

if (!isOpen) return null;

async function handleSendReportToDoctor() {
  const report_ids = selectedReports.map((data) => data._id);

  setSendReport(true); // loader start

  try {
    const result = await sendReportToDoctor(report_ids, doctor._id);
    console.log(result);

    if (result || result.message) {
      setMessage(result.message);
    }
  } catch (err) {
    setMessage("Something went wrong!");
    console.error(err);
  } finally {
    setSendReport(false); // loader stop (jab result ya error aa jaye)
  }
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
          <button className="popup-confirm-btn" onClick={handleSendReportToDoctor}>
            Send Report
          </button>
        </div>
        {
          message && <p>{message}</p>
        }

{
    sendReport && <span className="loader"></span>
}

      </div>
    </div>
  );
}