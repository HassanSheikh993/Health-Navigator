import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {verifyOTP_forForgetPassword} from "../../services/forgetPasswordApi"
import "../../styles/otpVerification.css";

export function OtpForgetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });


  async function handleOtpSubmit(e) {
  e.preventDefault();

  try {
    const result = await verifyOTP_forForgetPassword(email, otp);
    console.log("OTP verification result:", result);

    if (result.status === 200) {
      setMessage({ text: "Verification successful! Redirecting...", isError: false });

      setTimeout(() => {
        navigate("/update-password", { state: { email } });
      }, 1500);
    } else {
      setMessage({
        text: result.message || "Invalid OTP. Please try again.",
        isError: true,
      });
    }
  } catch (error) {
    console.error("OTP Verification Error:", error);

    if (
      error.response &&
      [400, 401, 500].includes(error.response.status)
    ) {
      setMessage({
        text: error.response.data?.message || "Request failed. Please try again.",
        isError: true,
      });
    } else {
      setMessage({
        text: "An unexpected error occurred. Please try again.",
        isError: true,
      });
    }
  }
}


  return (
    <div className="otp_container">
      <div className="otp_form_box">
        <h2 className="otp_heading">Email Verification For Re-Set Password</h2>
        <p className="otp_instruction">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>
        <form onSubmit={handleOtpSubmit} className="otp_form">
          <input
            type="text"
            className="otp_input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} // Only allow numbers and limit to 6 digits
            required
            pattern="\d{6}"
            title="Please enter exactly 6 digits"
          />
          <input type="submit" className="otp_submit" value="Verify" />
        </form>
        {message.text && (
          <p className={`otp_status_message ${message.isError ? 'error' : 'success'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}