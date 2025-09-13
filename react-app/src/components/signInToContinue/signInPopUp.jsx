import { useState,useEffect } from "react";
import "../../Styles/sendDoctorPopUp.css"
import { sendReportToDoctor } from "../../services/medicalReport";
import { useNavigate } from "react-router-dom";

export function SignInPopUp({ isOpen, onClose }) {
    const navigate = useNavigate();
    
    function handleLogin(){
        navigate("/Register")

    }
if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-btn" onClick={onClose}>
          &times;
        </button>
        <h1 className="popup-title">Login Required</h1>
        <p className="popup-message">
           To access this feature, you need to log in to your account.
        </p>
        <div className="popup-buttons">
          <button className="popup-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-confirm-btn" onClick={handleLogin}>
            Login
          </button>
        </div>

      </div>
    </div>
  );
}