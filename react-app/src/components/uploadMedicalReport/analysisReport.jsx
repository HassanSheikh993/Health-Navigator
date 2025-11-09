import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";
import "../../styles/UploadReport.css";

export function AnalyzeReport({ report }) {
  const reportRef = useRef();

  // 🧾 Function to generate and download PDF
  const handleDownloadPDF = () => {
    if (!reportRef.current) return;

    const element = reportRef.current;

    const options = {
      margin: 0.5,
      filename: "AI_Medical_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="AIGeneratedAnalysis_container">
      <h2>AI-GENERATED ANALYSIS RESULTS</h2>

      {/* Report Display */}
      <div className="AIGeneratedAnalysis_resultBox" ref={reportRef}>
        <div className="report-container markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report}
          </ReactMarkdown>
        </div>
      </div>

      {/* Download Button */}
      <div className="AIGeneratedAnalysis_shareButton">
        <p>Download Your Smart Report as PDF</p>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>
    </div>
  );
}
