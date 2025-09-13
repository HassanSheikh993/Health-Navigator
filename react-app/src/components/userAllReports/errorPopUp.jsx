
import { useState,useEffect } from "react";
import "../../Styles/sendDoctorPopUp.css"
import { sendReportToDoctor } from "../../services/medicalReport";

export function ErrorMessage({ isOpen, onClose,message }) {

      


if (!isOpen) return null;



  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-btn" onClick={onClose}>
          &times;
        </button>
        <h1 className="popup-title">Warring</h1>
        <p className="popup-message">
          {message}
        </p>
        <div className="popup-buttons">
          <button className="popup-cancel-btn" onClick={onClose}>
            Ok
          </button>
        </div>

      </div>
    </div>
  );
}