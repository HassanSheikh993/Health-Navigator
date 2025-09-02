import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { forgetPassword } from "../../services/forgetPasswordApi";
import "../../Styles/forgetPassword.css";

export function ForgetPassword() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error messages
  const [isLoading, setIsLoading] = useState(false); // Optional: For loading state

  function handleEmailInsert(e) {
    setUserEmail(e.target.value);
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      const result = await forgetPassword(userEmail);
      console.log(result);

      if (result.status) {
        // Success case - navigate to OTP page
        navigate("/Otp-ForgetPassword", { state: { email: userEmail } });
      } else {
        // Failure case - show error message
        setErrorMessage(result.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleBackToRegistration() {
    navigate("/Register");
  }

  return (
    <>
      <div className="container_forget_password">
        <div className="box_forget_password">
          <h1 className="title_forget_password">Trouble logging in?</h1>
          <p className="subtitle_forget_password">
            Enter your email and we'll send you an OTP to get back into your account.
          </p>

          {/* Error message display */}
          {errorMessage && (
            <div className="error_message_forget_password">
              {errorMessage}
            </div>
          )}

          <form className="form_forget_password" onSubmit={handleOnSubmit}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="input_forget_password"
              onChange={handleEmailInsert}
              required
            />
            <input
              type="submit"
              value={isLoading ? "Sending..." : "Send OTP"}
              className="submit_forget_password"
              disabled={isLoading}
            />
          </form>

          <div className="divider_forget_password">OR</div>

          <p className="create_account_forget_password" onClick={handleBackToRegistration}>
            Create a new account
          </p>
        </div>
      </div>
    </>
  );
}