import { useState } from "react";
import "../../styles/UploadReport.css"
import { useNavigate } from 'react-router-dom';
import { SaveReportPopup } from "./saveReportPopUp";
export function AnalyzeReport(){
     const navigate = useNavigate();
       const [showPopup, setShowPopup] = useState(false);

     function handleShare(){
        // navigate("/contact-doctor");
        navigate("/contact-doctor", { state: { shareMode: true } });
        window.scrollTo(0, 0);
     }
    
     function handleSave(){
     setShowPopup(true);
     }

function handleClosePopup() {
    setShowPopup(false);
  }

    return(
        <div className="AIGeneratedAnalysis_container">
    <h2>AI-GENERATED ANALYSIS RESULTS</h2>
   

<div className="AIGeneratedAnalysis_resultBox">
      <div className="report-container">
        <h1>Liver Health Report</h1>
        
        <section className="report-section">
            <h2>What the Results Mean</h2>
            <p>AST (45) and ALT (55) are two things that go up when the liver is hurt or stressed. These are both higher than normal, which means the liver might be inflamed or not healthy.</p>
            <p>The AST:ALT ratio (2.50) is also high. A high ratio like this sometimes points to a more serious liver issue, like scarring or long-term damage.</p>
            <p>GGTP (75) is a little high. This can happen when the liver or nearby tubes (called bile ducts) are having problems.</p>
            <p>Alkaline Phosphatase (12) is lower than normal. This can sometimes happen if someone isn’t getting enough nutrients or has some liver or bone problem.</p>
            <p>Bilirubin levels are important because they tell if the liver is clearing waste from the body. Yashvi’s direct (2.60) and indirect (1.90) bilirubin are high, which means the liver is not clearing waste well. This can lead to yellowish skin or eyes (jaundice).</p>
            <p>Total Protein (11.50) and Globulin (7.00) are both higher than normal. This might mean the liver is dealing with long-term stress or inflammation.</p>
            <p>Albumin (4.50) is normal, which is a good sign. It means the liver is still making some important body proteins.</p>
            <p>The A:G Ratio (0.64) is low, which shows an imbalance in liver proteins. This often points to a liver problem.</p>
        </section>
        
        <section className="report-section">
            <h2>What Could Be the Reason</h2>
            <p>The most likely reason for these changes is something called Non-Alcoholic Fatty Liver Disease (NAFLD). This usually happens when fat builds up in the liver. It’s often caused by things like:</p>
            <ul>
                <li>Eating too much unhealthy food</li>
                <li>Gaining weight</li>
                <li>Not being active or exercising</li>
                <li>Drinking too much sugary drinks</li>
            </ul>
            <p>It can also happen if someone drinks alcohol often.</p>
        </section>

        <section className="report-section">
            <h2>What Can Be Done to Improve It</h2>
            <p>Although only a doctor can give a proper treatment, here are some general steps that can help the liver get better:</p>
            <ul>
                <li>Eat healthy food (more fruits, vegetables, and home-cooked meals)</li>
                <li>Avoid junk food, oily food, and sugary drinks</li>
                <li>Exercise or walk daily</li>
                <li>Don’t drink alcohol</li>
                <li>Drink enough water every day</li>
                <li>Get enough sleep and reduce stress</li>
            </ul>
            <p>Also, it’s important to visit a doctor for a full checkup to confirm the condition and get the right treatment plan.</p>
        </section>
    </div>
        </div>


<div className="AIGeneratedAnalysis_shareButton ">
<p>Need Expert Advice? Share This Report With a Doctor!"</p>
<button onClick={handleShare}>Share</button>
<button onClick={handleSave}>Save</button>
</div>


    <SaveReportPopup 
        isOpen={showPopup} 
        onClose={handleClosePopup} 
      />


</div>

    )
}