import { useState, useEffect, useRef } from "react";
import "../../Styles/UploadReport.css";
import { SaveReportPopup } from "./saveReportPopUp";
import { SignInPopUp } from "../signInToContinue/signInPopUp";
import { loginUserData } from "../../services/api";
import { uploadMedicalReport } from "../../services/medicalReport";
import HtmlTemplate from "./HtmlTemplate";

// NEW IMPORTS (replace React-PDF)
import { generateReportPdf } from "../../utils/generatePdf";
import logoBase64 from "../../utils/logoBase64";

export function AnalyzeReport({ report, originalReport, structuredData }) {
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setLoginData] = useState(null);
  const [generatedPdf, setGeneratedPdf] = useState(null);

  useEffect(() => {
    async function getUser() {
      const result = await loginUserData();
      setLoginData(result && !result.message ? result : null);
    }
    getUser();
  }, []);

  // ---------------------- DOWNLOAD PDF ----------------------
  const handleDownloadPDF = async () => {
    try {
      const blob = await generateReportPdf(report, logoBase64);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medical-report-${Date.now()}.pdf`;
      a.click();
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  // ---------------------- SAVE TO BACKEND ----------------------
  const handleSave = async () => {
    try {
      const blob = await generateReportPdf(report, logoBase64);

      const pdfFile = new File([blob], `ai-report-${Date.now()}.pdf`, {
        type: "application/pdf",
      });

      setGeneratedPdf(pdfFile);
      setShowPopup(true);
    } catch (err) {
      console.error("Save PDF generation failed:", err);
    }
  };

  return (
    <div className="AIGeneratedAnalysis_container">
      <h2>AI-GENERATED ANALYSIS RESULTS</h2>

      {/* PREVIEW USING YOUR HTML MARKDOWN TEMPLATE */}
      <HtmlTemplate markdownText={report} />

      {/* BUTTONS */}
      <div className="AIGeneratedAnalysis_shareButton">
        <p>Keep a Copy of Your Report – Save Now!</p>

        <div className="buttonGroup">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      </div>

      {/* SAVE OR LOGIN POPUPS */}
      {userData && (
        <SaveReportPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          report={report}
          originalFile={originalReport}
          structuredData={structuredData}
          pdfFile={generatedPdf}
        />
      )}

      {!userData && showPopup && (
        <SignInPopUp isOpen={showPopup} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
