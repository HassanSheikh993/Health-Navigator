import {HeroSection} from "./heroSection";
import {CombinedComponent} from "./mainSection";
import {OurPhilosophy} from "./OurPhilosophy";
import Nav from "../../Health Navigator/Nav";
import Footer from "../../Health Navigator/Footer";



export function About(){
    return(
        <>
     <Nav></Nav>
        <HeroSection/>
        <CombinedComponent/>
        <OurPhilosophy/>
<Footer></Footer>
        </>
    )
}