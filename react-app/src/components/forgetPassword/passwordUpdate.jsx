import { useState } from "react";
import { updatePassword } from "../../services/forgetPasswordApi"
import { useNavigate,useLocation } from "react-router-dom";
import "../../Styles/passwordUpdate.css"
export function UserPasswordUpdate(){
     const navigate = useNavigate();
     const location = useLocation();
      const email = location.state?.email;
      console.log(email);
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");
      const [message,setMessage] = useState("")

     const handleSubmit = async (e) => {
  e.preventDefault();

  if (password.length < 8) {
    setError("Password must be at least 8 characters long");
    return;
  }

  try {
    const result = await updatePassword(email, password);
    console.log(result);

    if (result.status === 200 || result.success) {
       setMessage(result.message)
      setTimeout(() => {
        navigate("/Register");
      }, 1000);
    } else {
      setError(result.message || "Failed to update password");
    }
  } catch (error) {
    console.error("Error:", error);

    if (
      error.response &&
      [400, 401, 404, 500].includes(error.response.status)
    ) {
      setError(error.response.data?.message);
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  }
};

    return(
        <>
        <div className="update_password_container">
      <h2 className="update_password_title">Update Password</h2>
      {error && <div className="error_message">{error}</div>}
      {message  && <div className="success_message">{message}</div>}
      <form onSubmit={handleSubmit} className="update_password_form">
       
        <input
          type="text"  
          placeholder="Enter new password (min 8 characters)"
          className="update_password_input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="update_password_button">
          Update
        </button>
      </form>
    </div>
        </>
    )
}
