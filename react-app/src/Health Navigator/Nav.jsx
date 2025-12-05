import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import { logoutUser, loginUserData } from '../services/api';
import toast from 'react-hot-toast';
function Nav() {
  const [name, setName] = useState("");
  const [userData, setUserData] = useState();
  const [dropDown, setDropDown] = useState(false);
  const navigate = useNavigate();

  console.log("userData ", userData)
  // Refs for detecting outside click
  const profileIconRef = useRef(null);
  const dropDownRef = useRef(null);

  useEffect(() => {
    async function callBack() {
      const result = await loginUserData();
      if (result?.name) setName(result.name);
      setUserData(result)
    }
    callBack();
  }, []);

  function handleProfileButton() {
    setDropDown(prev => !prev);
  }

  function handleGoToProfile() {
    navigate("/edit-profile");
  }
  function handleDashboard() {
    navigate("/doctor-portal");
  }
function handleFeedBack() {
    navigate("/userFeedBack-history");
  }
  async function handleLogout() {
    let result = await logoutUser();
    if (result.status === true) {
      navigate("/Register");
      toast.success("Logout Successfully")
    }
  }

  function handleOnClick(){
     navigate("/")
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropDown &&
        dropDownRef.current &&
        profileIconRef.current &&
        !dropDownRef.current.contains(e.target) &&
        !profileIconRef.current.contains(e.target)
      ) {
        setDropDown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDown]);

  return (
    <>
      <div className="header">
        <div className="logo">
          <img src="/images/newLogo.png" alt="" onClick={handleOnClick} className='nav_logo'/>
          <h4  className= "logoName" >Health Navigator</h4>
        </div>

        <nav className="navBar">
          <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/About">About</RouterLink></li>
            <li>
              <Link to="contact" smooth={true} duration={300} offset={-70} style={{ cursor: 'pointer' }}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="loginbtn">
          {name ? (
            <div
              className='nav_profile_icon'
              onClick={handleProfileButton}
              ref={profileIconRef}
            >

              <img
                className="nav_userProfile_image"
                src={`http://localhost:8000${userData.picture}`}
                alt="User Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/user.png";
                }}
              />          </div>
          ) : (
            <button onClick={() => navigate('/Register')}>Login/Register</button>
          )}
        </div>

        {dropDown && (
          <div className="nav_dropDown_container" ref={dropDownRef}>
            <p className="nav_dropDown_item" onClick={handleGoToProfile}>Profile</p>
            {userData?.role === "doctor" && (
  <p className="nav_dropDown_item" onClick={handleDashboard}>Dashboard</p>
)}

            <p className="nav_dropDown_item" onClick={handleFeedBack}>Feedback History</p>
            <p className="nav_dropDown_item" onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Nav;