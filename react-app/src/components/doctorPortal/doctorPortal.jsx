import { DoctorDashBoard } from "./doctorDashboard"
import { MessageSendByUserToPatient } from "./doctorDashboard"
import Nav from "../../Health Navigator/Nav"
import Footer from "../../Health Navigator/Footer"
export function DoctorPortal(){
    return(

<>
<Nav/>
<DoctorDashBoard/>
<MessageSendByUserToPatient/>
<Footer/>
</>
    )
}