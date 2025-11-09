import { useState } from "react";
import { useNavigate } from 'react-router-dom';


import { registerUser,verifyUserLogin } from "../services/api";
import "../styles/registration.css";

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "user" });

  // --
  let [loading, setLoading] = useState(false);
  // --

  const [messageStatus, setMessage] = useState("");
  const [isRegisterVisible, setIsRegisterVisible] = useState(false); // State to toggle between Sign In and Register
  const [passwordError, setPasswordError] = useState(false);
  const [loginUser,setLoginUser]= useState({email:"",password:""});
  // const navigate = useNavigate();
  //login
  function handleLoginInputChange(e){
setLoginUser({...loginUser,[e.target.name]:e.target.value})
  }

 async function handleLoginSubmit(e){
e.preventDefault();
let result = await verifyUserLogin(loginUser);
console.log("Result message success message", result.success)
console.log(result)
setMessage(result.message)
if (result.success === false) {
  setPasswordError(true);
} else {
  // const email = result.userEmail;
  // const sendEmail = email.split("@")[0];
  // navigate("/",{ state: { name: sendEmail } })
  navigate("/");
  setPasswordError(false);
}


}

  // registration------------------------------------------
  function handleRegistrationInputChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }
async function handleRegistrationSubmit(e) {
  e.preventDefault();
  setMessage(null);  //
  setLoading(true);  //
try{
    const result = await registerUser(user);

  setMessage(result.message);

  if (!result.error && result.status) {
    // Navigate to OTP screen and pass email
    navigate("/verify-otp", { state: { email: user.email } });
  } else {
    setPasswordError(true);
  }
}catch(err){
  console.log(err);
}finally{
  setLoading(false)
}
}

  function toggleForm() {
    setIsRegisterVisible(!isRegisterVisible);
    setPasswordError(false);
    setMessage(null);
    setUser({name:"",email:"",password:""});
    setLoginUser({email:"",password:""});
  }


  function handleForgetPassword(){
    navigate("/forget-password")
  }

  return (

    <div className="container_register">
       <div className="heart_image"><img src="/images/heart1.png" alt="" /></div>
      <div className="form_box">
        <div className="intro">
          <h1>WELCOME BACK!</h1>
          <h2>SIGN IN TO YOUR HEALTH NAVIGATOR ACCOUNT</h2>
          <p>
            "Access your health insight, track progress, and manage your reports with ease"
          </p>
        </div>

        <div className="login_register_box">
          {/* Sign In Box */}
          <div
            className={`signin_box ${
              isRegisterVisible ? "signin_box_position_change" : ""
            }`}
          >
            <h2 className="signin_text">Sign In</h2>
            <form onSubmit={handleLoginSubmit}>
              <input type="email" placeholder="Enter Email" name="email" value={loginUser.email} required onChange={handleLoginInputChange} />
              <input type="password" placeholder="Password" name="password" value={loginUser.password} required onChange={handleLoginInputChange} />
              <input type="submit" value="Submit" />
            </form>
            <h3 className={`status_message ${passwordError && "loginPasswordError"}`}>{messageStatus}</h3>
            <p className="forget_password" onClick={handleForgetPassword}>Forgot password?</p>
            <p className="login_signup_option">
              "New to health navigator?"{" "}
              <span className="change_btn" onClick={toggleForm}>
                Create an Account
              </span>
            </p>
          </div>

          {/* Register Box */}
          <div
            className={`register_box register_position_side ${
              isRegisterVisible ? "register_box_position_change" : ""
            }`}
          >
            <h2 className="signin_text">Register Now</h2>
            <form onSubmit={handleRegistrationSubmit}>
              <input
                type="text"
                placeholder="Username"
                name="name"
                value={user.name}
                required
                onChange={handleRegistrationInputChange}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={user.email}
                required
                onChange={handleRegistrationInputChange}
              />
              <input
              className={passwordError && "passwordError"}
                type="password"
                placeholder="Password"
                name="password"
                value={user.password}
                required
                onChange={handleRegistrationInputChange}
                
              />

<div className="role_selection">
  <label>
    <input
      type="radio"
      name="role"
      value="user"
      checked={user.role === "user"}
      onChange={handleRegistrationInputChange}
      required
    />
    Patient
  </label>
  <label>
    <input
      type="radio"
      name="role"
      value="doctor"
      checked={user.role === "doctor"}
      onChange={handleRegistrationInputChange}
    />
    Doctor
  </label>
</div>

              <input type="submit" value="Submit" />
            </form>
            <h3 className="status_message">{messageStatus}</h3>
            
{/* <div className="registerWithGoogle"><p>Continue with Google</p>
<img src="/images/google7.png" alt="" /></div> */}


{/* ---------------------------- */}
 {loading ? <span className="loader"></span> : 

            <p className="login_signup_option">
              Already have an account?{" "}
              <span className="change_btn" onClick={toggleForm}>
                Sign In
              </span>
            </p>
}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;