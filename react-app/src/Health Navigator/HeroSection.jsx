import { React } from 'react'
import banner from '../assets/banner.png'
import heroimg from '../assets/heroimg.png'
import { scroller } from 'react-scroll';
// import ourImage from '../assets/ourImage.png'
import { cookiesData } from "../services/api.jsx"
function HeroSection() {

    const handleFeatureClick = (e) => {
        e.preventDefault();
        scroller.scrollTo('features', {
            duration: 500,
            smooth: true,
            offset: -70,
        });
    }



    return (
        <>

            <div className="banner">
                <div className="bannercontent">
                    <div className="heading">
                        <h1>SIMPLIFY YOUR REPORTS</h1>
                        <h3>Understand Medical Report with Ease</h3>
                        <button onClick={handleFeatureClick} className='heroSection_feature_button'>Features</button>
                    </div>
                    <div className="heroimg">
                        <img src={heroimg}></img>
                         {/* <img src="../../public/images/drhassan-bg.png"></img> */}
                    </div>
                </div>



                <div className="custom-shape-divider-bottom-1742389367">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                    </svg>
                </div>

            </div>

            {/* <div className="front-box">
 
<h3>All-in-One Health Report Companion</h3>
<h5>Helping Patients & Doctors Understand Medical Reports.</h5>

            </div> */}




            <div className="front-box">
                <div className="front-box-inner">

                    {/* FRONT SIDE */}
                    <div className="front-box-front">
                        <h3>All-in-One Health Report Companion</h3>
                        <h5>Helping Patients & Doctors Understand Medical Reports.</h5>
                    </div>

                    {/* BACK SIDE */}
                    <div className="front-box-back">
                        <h3>Ai-Powered Report Analysis</h3>
                        <p>Real-Time Health Monitoring, Secure & Private, Send reports to Doctors</p>
                    </div>

                </div>
            </div>
        </>
    )
}

export default HeroSection