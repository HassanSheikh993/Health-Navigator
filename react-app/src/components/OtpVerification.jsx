import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../services/api";
import "../styles/otpVerification.css";

function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  async function handleOtpSubmit(e) {
    e.preventDefault();

    const result = await verifyOTP(email, otp);

    if (result.success) {
      setMessage("Verification successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/Register", { state: { otpVerified: true } });
      }, 2000);
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  }

  return (
    <div className="otp_container">
      <div className="otp_form_box">
        <h2 className="otp_heading">Email Verification</h2>
        <p className="otp_instruction">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>
        <form onSubmit={handleOtpSubmit} className="otp_form">
          <input
            type="text"
            className="otp_input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input type="submit" className="otp_submit" value="Verify" />
        </form>
        <p className="otp_status_message">{message}</p>
      </div>
    </div>
  );
}

export default OtpVerification;
