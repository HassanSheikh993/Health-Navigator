import { useState, useEffect, useRef } from "react";
import "../../styles/UploadReport.css";
import { SaveReportPopup } from "./saveReportPopUp";
import { SignInPopUp } from "../signInToContinue/signInPopUp";
import { loginUserData } from "../../services/api";
import { uploadMedicalReport } from "../../services/medicalReport";
import html2pdf from "html2pdf.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AnalyzeReport({ report }) {
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setLoginData] = useState(null);
  const reportRef = useRef(null);

  const selectedReport = report;

  // 🟢 Fetch user session data
  async function callBack() {
    const result = await loginUserData();
    setLoginData(result && !result.message ? result : null);
  }

  useEffect(() => {
    callBack();
  }, []);

  const handleSave = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  // 🟢 Generate & download PDF using html2pdf.js
  const handleDownload = () => {
    const element = reportRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `medical-report-${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  // 🟢 Optional: Save report to backend (called from SaveReportPopup)
  const handleSaveToBackend = async () => {
    try {
      const formData = new FormData();
      formData.append("report", selectedReport);
      const response = await uploadMedicalReport(formData);
      console.log("✅ Report saved successfully:", response);
    } catch (error) {
      console.error("❌ Error saving report:", error);
    }
  };

  return (
    <div className="AIGeneratedAnalysis_container">
      <h2>AI-GENERATED ANALYSIS RESULTS</h2>

      <div className="AIGeneratedAnalysis_resultBox" ref={reportRef}>
        <div className="report-container markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report}
          </ReactMarkdown>
        </div>
      </div>

      <div className="AIGeneratedAnalysis_shareButton">
        <p>Keep a Copy of Your Report – Save Now!</p>
        <div className="buttonGroup">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDownload}>Download PDF</button>
        </div>
      </div>

      {userData && (
        <SaveReportPopup
          isOpen={showPopup}
          onClose={handleClosePopup}
          report={selectedReport}
          onSave={handleSaveToBackend}
        />
      )}

      {!userData && showPopup && (
        <SignInPopUp isOpen={showPopup} onClose={handleClosePopup} />
      )}
    </div>
  );
}
