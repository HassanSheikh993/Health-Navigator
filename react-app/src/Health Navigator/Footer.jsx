import React from 'react'
import logo from '../assets/logo.png'
import fbicon from '../assets/facebook.png'
import instaicon from '../assets/instagram.png'
import twittericon from '../assets/twitter.png'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { scroller } from 'react-scroll';
function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFeatureClick = (e) => {
    e.preventDefault();

    if (location.pathname === '/') {
      scroller.scrollTo('features', {
        duration: 500,
        smooth: true,
        offset: -70,
      });
    } else {
      navigate('/?scroll=features');
    }
  };
  return (
    <>

      <div className="Design">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220"><path fill="#fff" fill-opacity="1" d="M0,128L80,112C160,96,320,64,480,80C640,96,800,160,960,165.3C1120,171,1280,117,1360,90.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
      </div>
      <footer>
        <div className="contact">
          <h1>Contact Us</h1>
          <form id='contact'>
            <div className="contactForm">
              <input type="text" placeholder='First Name' />
              <input type="text" placeholder='Last Name' />
              <input type="tel" placeholder='Phone Number' />
              <input type="email" placeholder='Email' />
              <textarea name="contactarea" id="contactdesc">How can we help you?</textarea>
              <div className="submitbtn">
                <button>Submit</button>
              </div>
            </div>
          </form>
        </div>
        <div className="footerInformation">
          <div className="logo">
            {/* <img src={logo}></img> */}
             <img src="/images/newLogo.png" alt="" />
          </div>
          <div className='information'>
            <p>
              Imagine waking up feeling unwell. You recently had a medical test, but as you scroll through the complex numbers and terms in your report, you feel confused and unsure. What do these values mean? Should you be worried? Where can you find the right doctor?
              This is where Health Navigator steps in-your personal health companion, making medical reports easy to understand, track, and act upon.
            </p>
          </div>

        </div>

        <div className="footernav">
          <div className="navlink">
            <ul>
              <li><Link to='/'> Home</Link></li>
              <li><Link to='/About'> About Us</Link></li>
              <li><Link to='/?scroll=features' onClick={handleFeatureClick}>Features</Link></li>
            </ul>
          </div>
          <div className="navicon">
            <p>Quick Links</p>
            <ul>
              <li><img src={fbicon}></img></li>
              <li><img src={instaicon}></img></li>
              <li><img src={twittericon}></img></li>
            </ul>

          </div>
          <div>
            <p style={{ color: "white" }}>C all right reserved .white Space</p>
          </div>
        </div>
      </footer>


    </>
  )
}

export default Footer