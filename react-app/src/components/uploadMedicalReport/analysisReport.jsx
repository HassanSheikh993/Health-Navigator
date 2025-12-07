import { useState, useEffect } from "react";
import "../../Styles/UploadReport.css";
import { SaveReportPopup } from "./saveReportPopUp";
import { SignInPopUp } from "../signInToContinue/signInPopUp";
import { loginUserData } from "../../services/api";
import { downloadSmartReport } from "../../services/medicalReport";
import HtmlTemplate from "./HtmlTemplate";

export function AnalyzeReport({ report, originalReport, structuredData, ml_result }) {
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function getUser() {
      const result = await loginUserData();
      setUserData(result && !result.message ? result : null);
    }
    getUser();
  }, []);

  // ---------------------- DOWNLOAD PDF ----------------------
  const handleDownloadPDF = async () => {
    try {
      const html = document.querySelector("#markdown-content")?.innerHTML || "";
      const pdfBlob = await downloadSmartReport(html);


      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medical-report-${Date.now()}.pdf`;
      a.click();
    } catch (err) {
      console.error("PDF download error:", err);
    }
  };

  // ---------------------- SAVE TO BACKEND ----------------------
  const handleSave = () => {
    setShowPopup(true);
  };

  return (
    <div className="AIGeneratedAnalysis_container">
      <h2>AI-GENERATED ANALYSIS RESULTS</h2>

      <HtmlTemplate markdownText={report} />

      {/* ❗ SHOW BUTTONS ONLY IF VALID REPORT IS GENERATED */}
      {structuredData && (
        <div className="AIGeneratedAnalysis_shareButton">
          <p>Keep a Copy of Your Report – Save Now!</p>

          <div className="buttonGroup">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleDownloadPDF}>Download PDF</button>
          </div>
        </div>
      )}

      {userData && (
        <SaveReportPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          reportHtml={document.querySelector("#markdown-content")?.innerHTML || ""}
          originalFile={originalReport}
          structuredData={structuredData}
          ml_result={ml_result}
        />
      )}

      {!userData && showPopup && (
        <SignInPopUp isOpen={showPopup} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
