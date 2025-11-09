import Footer from "../../Health Navigator/Footer";
import Nav from "../../Health Navigator/Nav";
import { UploadReport } from "./uploadReport";


export function UploadMedicalReportMainPage(){
    return(
        <>
        <Nav/>
        <UploadReport/>
        <Footer/>

        </>
    )
}