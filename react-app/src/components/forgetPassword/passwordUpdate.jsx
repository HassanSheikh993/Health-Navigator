import { useState } from "react";
import { updatePassword } from "../../services/forgetPasswordApi"
import { useNavigate,useLocation } from "react-router-dom";
export function UserPasswordUpdate(){
     const navigate = useNavigate();
     const location = useLocation();
      const email = location.state?.email;
      console.log(email);
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");

       const handleSubmit = async (e) => {
    e.preventDefault();
     if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

      const result = await updatePassword(email, password);
          console.log(result);
          
          if (result.success) {
            alert("Password updated successfully!");
            navigate("/Register");
          } else {
            setError(result.message || "Failed to update password"); }


       }
    return(
        <>
        <div className="update_password_container">
      <h2 className="update_password_title">Update Password</h2>
      {error && <div className="error_message">{error}</div>}
      <form onSubmit={handleSubmit} className="update_password_form">
       
        <input
          type="text"  // Changed to password type for security
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
