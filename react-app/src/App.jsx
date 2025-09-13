
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import './index.css'
import './Styles/Footer.css'
import './Styles/Nav.css'
import './Styles/HeroSection.css'
import './Styles/Features.css'
import './Styles/TrackHealthcover.css'


import Register from "./components/Registration";
import OtpVerification from "./components/OtpVerification";
import Homeview from './Health Navigator/Homeview';
import TrackHealth from './Health Navigator/TrackHealth';
import {UploadReport} from "./components/uploadMedicalReport/uploadReport"   //
import {About} from "./components/AboutUs/aboutpage"
import {MainContactDoctor} from "./components/contactDocter.jsx/mainComponetToRun"
import { EditProfile } from "./components/profileSetup/editProfile";
import { DoctorPortal } from "./components/doctorPortal/doctorPortal";

import { ForgetPassword } from "./components/forgetPassword/passwordForget";
import { OtpForgetPassword } from "./components/forgetPassword/forgetPasswordOTP";

import { UserPasswordUpdate } from "./components/forgetPassword/passwordUpdate";
import { Profile } from "./components/profileSetup/profile";
import { ReportDetails } from "./components/doctorPortal/reportDetails";
import { DoctorHistory, ShowDoctorHistory } from "./components/doctorPortal/showDoctorHistory";
import { UserMessage } from "./components/doctorPortal/userMessage";
import { AllUserReport } from "./components/userAllReports/userReports";
import { LiverReportsChart } from "./components/try";
import{ LiverReportsLineChart } from "./components/try2";
import { LiverReportsBarChart } from "./components/try3";
import { UploadMedicalReportMainPage } from "./components/uploadMedicalReport/uploadMedicalReportMain";





function App() {
  return (
    <>
   
<Router>
  <Routes>
    <Route path='/' element={<Homeview/>}/>
    <Route path='/TrackHealth' element={<TrackHealth/>}/>

      <Route path="/Register" element={<Register />} />
        {/* <Route path="/upload-report" element={<UploadReport />} /> */}
                <Route path="/upload-report" element={<UploadMedicalReportMainPage />} />

        <Route path="/About" element={<About />} />
        <Route path="/contact-doctor" element={<MainContactDoctor />} />
        <Route path="/edit-profile" element={<Profile />} />
        <Route path="/doctor-portal" element={<DoctorPortal />} />
        <Route path="/verify-otp" element={<OtpVerification />} />

        <Route path="/forget-password" element={<ForgetPassword/>} />
        <Route path="/Otp-ForgetPassword" element={<OtpForgetPassword/>} />
        <Route path="/update-password" element={<UserPasswordUpdate/>} />

        <Route path="/reportDetails" element={<ReportDetails/>} />
         <Route path="/showDoctorHistory" element={<DoctorHistory/>} />
          <Route path="/allReports" element={<AllUserReport/>} />
          
          <Route path="/try" element={<LiverReportsBarChart/>} />
          <Route path="/try2" element={<LiverReportsLineChart/>} />


        
        
       

  </Routes>

</Router>


 </>
  );
 }
export default App
