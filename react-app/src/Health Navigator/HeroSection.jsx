import {React} from 'react'
import banner from '../assets/banner.png'
import heroimg from '../assets/heroimg.png'
import { scroller } from 'react-scroll';

import {cookiesData} from "../services/api.jsx"
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
                        <button onClick={handleFeatureClick}>Features</button>
                    </div>
                    <div className="heroimg">
                        <img src={heroimg}></img>
                    </div>
                </div>



                <div className="custom-shape-divider-bottom-1742389367">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
                    </svg>
                </div>

            </div>

            <div className="front-box">
                {/* <div className="search">
    <h3>Type Keywords</h3>
    <input type='search' placeholder='Ex Upload report etc '></input>
    </div>
  <div className="searchoption">
    <h3>Select Option</h3>
    <input type='radio'></input>
    <label>Patient</label>
    <input type='radio'></input>
    <label>Doctor</label> 
  </div>*/}
<h3>All-in-One Health Report Companion</h3>
<h5>Helping Patients & Doctors Understand Medical Reports.</h5>

            </div>





















            {/* <div className="banner">
            <div className='heroimg'>
       
            <img src={heroimg} id='heroimg'></img>
            </div>
            <div className="heading">
                <h1>SIMPLIFY YOUR HEALTH </h1>
                <h4>Understand Medical Reports with Ease</h4>
                <button>Features</button>
            </div>
            </div>
            <div className="searchBox">
                <div className="searchoption">
                <div className="searchbar">
                    <h3>Type keywords</h3>
                    <input type='search' placeholder='Ex Upload Report etc'></input>
                </div>
                <div className="options">
                    <h3>Select Options</h3>
                    <input type='radio'></input>
                    <label>Patient</label>
                    <input type='radio'></input>
                    <label>Doctor</label>
                </div>
            </div>
            </div>
       

         <svg id='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,288L120,261.3C240,235,480,181,720,170.7C960,160,1200,192,1320,208L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path></svg>
       */}
        </>
    )
}

export default HeroSection