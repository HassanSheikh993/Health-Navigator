
import "../../styles/contactDoctor.css"
import { ContactDoctor } from "./ContactDoctor"
import Nav from "../../Health Navigator/Nav";
import Footer from "../../Health Navigator/Footer";
import { useEffect } from "react";

export function MainContactDoctor(){
    useEffect(()=>{
        window.scrollTo(0, 0);
    })
    return(
        <>
<Nav/>
        <div className="doctor_container_heroSection">
        <div className="doctor_heading_title"> <h1>Meet Our Specialists</h1> </div>
        <div className="doctor_heading_paragraph"><p>Following is the list of available doctors</p></div>
       <div className="doctor_heart_image"><img src="/images/heart1.png" alt="" /></div>

       </div>
<ContactDoctor/>

<Footer/>

        </>
    )
}