import { useState, useEffect, useRef } from "react";
import "../../styles/UploadReport.css";
import { SaveReportPopup } from "./saveReportPopUp";
import { SignInPopUp } from "../signInToContinue/signInPopUp";
import { loginUserData } from "../../services/api";
import { uploadMedicalReport } from "../../services/medicalReport";
import html2pdf from "html2pdf.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AnalyzeReport({ report, originalReport, structuredData }) {
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setLoginData] = useState(null);
  const [generatedPdf, setGeneratedPdf] = useState(null); // 🟢 stores generated PDF file
  const reportRef = useRef(null);

  console.log("ORIGINAL REPORT:", originalReport);
  console.log("REPORT YEH HAI BHAI:", report);

  // 🟢 Fetch user session data
  async function callBack() {
    const result = await loginUserData();
    setLoginData(result && !result.message ? result : null);
  }

  useEffect(() => {
    callBack();
  }, []);

  // 🟢 Handle showing popup + generating PDF for backend
  const handleSave = async () => {
    const element = reportRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    try {
      // Generate PDF blob (doesn't download)
      const pdfBlob = await html2pdf().set(opt).from(element).output("blob");

      // Convert blob to File for uploading
      const pdfFile = new File([pdfBlob], `ai-report-${Date.now()}.pdf`, {
        type: "application/pdf",
      });

      // Save in state for popup use
      setGeneratedPdf(pdfFile);

      // Open popup
      setShowPopup(true);
    } catch (err) {
      console.error("Error generating PDF for save:", err);
    }
  };

  // 🟢 Close popup
  const handleClosePopup = () => setShowPopup(false);

  // 🟢 Generate & download PDF to user device
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

  // 🟢 Save both original and AI report to backend
  // const handleSaveToBackend = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("originalReport", originalReport);
  //     if (generatedPdf) {
  //       formData.append("aiReportPDF", generatedPdf);
  //     }

  //     const response = await uploadMedicalReport(formData);
  //     console.log("✅ Report saved successfully:", response);
  //   } catch (error) {
  //     console.error("❌ Error saving report:", error);
  //   }
  // };

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

      {/* 🟢 Conditional rendering based on user login */}
      {userData && (
        <SaveReportPopup
          isOpen={showPopup}
          onClose={handleClosePopup}
          report={report}
          originalReport={originalReport}
          structuredData={structuredData}
          pdfFile={generatedPdf}
          // onSave={handleSaveToBackend}
        />
      )}

      {!userData && showPopup && (
        <SignInPopUp isOpen={showPopup} onClose={handleClosePopup} />
      )}
    </div>
  );
}
