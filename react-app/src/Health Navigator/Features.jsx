import React from 'react'
import reportupload from '../assets/reportupload.png'
import doctor from '../assets/doctor.png'
import trendimg from '../assets/trend.png'
import docs from '../assets/docs.png'
import docimg from '../assets/docimg2.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
function Features() {
     const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/upload-report');
  };
    return (
        <>
            <div className="headingabout">
                <h1>Why Choose Health Navigator?</h1>
                <h3>UNLOCK POWERFUL FEATURES TO UNDERSTAND AND TRACK YOUR HEALTH WITH EASE </h3>
            </div>

            <div className="cardcontainer" id='features'>
                <div className="card">
                    <div className="cardimg">
                        <img src={reportupload}></img>
                    </div>
                    <div className="cardtitle">
                        <h5>UPLOAD AND ANALYZE REPORT</h5>
                        <h6>easily upload medical report & get simplified report</h6>
                    </div>
                    <div className="cardbutton">
                    <Link to='/upload-report'>→</Link>
                      
                    </div>
                </div>
                <div className="card">
                    <div className="cardimg">
                        <img src={trendimg}></img>
                    </div>
                    <div className="cardtitle">
                        <h5>TRACK HEALTH TRENDS</h5>
                        <h6>Visual graph and progress bars for tracking key health matrics</h6>
                    </div>
                    <div className="cardbutton">
                    <Link to='/TrackHealth'>→</Link>
                    </div>
                </div>
                <div className="card">
                    <div className="cardimg">
                        <img src={doctor}></img>
                    </div>


                    <div className="cardtitle">
                        <h5>CONNECT TO DOCTOR</h5>
                        <h6>Sending report to the doctors <br> 
                        </br>
                        <br> 
                        </br>
                        </h6>
                    </div>
                    <div className="cardbutton">
                    <Link to='/Contact-Doctor'>→</Link>
                    </div>
                </div>
            </div>

            <div className='section'>

                <div className="sectioncontent">
                    <div className="sectionimg">
                        <img src={docs} id='img1'></img>
                        <img src={docimg} id='img2'></img>
                    </div>
                    <div className="sectiontext">
                        <div className="sectionheading">
                            <h5>Start Your Journey today-Because Your Health maatters!</h5>
                            <h2>A JOURNEY TO SIMPLIFIED HEALTH NAVIGATOR</h2>
                            <h6>with Health Navigator, you no longer need to be confused about your medical reports. we bridge the gap between complex health data and real-world understanding, helping you making informed decisions for a healthier life</h6>
                        </div>
                        <div className="keypoints">
                            <ul>
                                <li>Ai-Powered Report Analysis - medical data simplified with intelligent insights.</li>
                                <li>Real-Time Health Monitoring - Track and visualize trends in Liver and more.</li>
                                <li>Secure & Private - Your health data is protected with advanced encryption.</li>
                                <li>Send reports to Doctors - Get personalized health suggestions based on your reports.</li>
                            </ul>
                        </div>
                        <div className="uploadbtn">
                        <button onClick={handleUploadClick}>Upload Reports   →</button>
                        </div>
                    </div>
                    <div class="custom-shape-divider-bottom-1742453959">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" class="shape-fill"></path>
    </svg>
</div>
                </div>
          
            </div>

            <div className="endpoint">
     <h3>"Your Health,Simplified-Understand, Track and Take Action!"</h3>
            </div>
            
        </>


    )
}
export default Features