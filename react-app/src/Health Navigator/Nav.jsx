import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import { logoutUser, loginUserData } from '../services/api';

function Nav() {
  const [name, setName] = useState("");
  const [userData,setUserData] = useState();
  const [dropDown, setDropDown] = useState(false);
  const navigate = useNavigate();

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

  async function handleLogout() {
    let result = await logoutUser();
    if (result.status === true) {
      navigate("/Register");
    }
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
          <img src="/images/newLogo.png" alt="" style={{ width: "80px" }} />
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
  src={userData.picture ? `http://localhost:8000${userData.picture}` : "/images/user.png"}
  alt="User Profile"
/>            </div>
          ) : (
            <button onClick={() => navigate('/Register')}>Login/Register</button>
          )}
        </div>

        {dropDown && (
          <div className="nav_dropDown_container" ref={dropDownRef}>
            <p className="nav_dropDown_item" onClick={handleGoToProfile}>Profile</p>
            <p className="nav_dropDown_item" onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Nav;
