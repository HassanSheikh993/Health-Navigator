import { useState, useRef, useEffect } from "react";
import { AnalyzeReport } from "./analysisReport";
import "../../styles/UploadReport.css";
import { uploadMedicalReport } from "../../services/medicalReport";

export function UploadReport() {
  const [condition, setCondition] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectFileUpload, setSelectFileUpload] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showNoFileSelected, setShowNoFileSelected] = useState(false);
  const [smartReport, setSmartReport] = useState(null);

  const fileInputRef = useRef(null);
  const sectionRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectFileUpload(selectedFile);
      setSelectedFileName(selectedFile.name);
      setShowNoFileSelected(false);
      console.log("Uploaded file:", selectedFile.name);
    }
  };

  const handleAnalyzeReport = async () => {
    if (!selectFileUpload) {
      setShowNoFileSelected(true);
      return;
    }

    setShowLoader(true);
    setCondition(true);

    try {
      const result = await uploadMedicalReport(selectFileUpload);
      console.log("✅ Smart Report Response:", result);

      if (result.success && result.smartReport) {
        setSmartReport(result.smartReport);
      } else {
        setSmartReport("No AI-generated content available.");
      }
    } catch (error) {
      console.error("❌ Error analyzing report:", error);
      setSmartReport("Error while generating report. Please try again.");
    } finally {
      setShowLoader(false);
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <>
      <div>
        <div className="UploadReportHeroSection">
          <div className="heart_image">
            <img src="/images/heart1.png" alt="" />
          </div>
          <div className="medicalCross_image">
            <img src="/images/medical1.png" alt="" />
          </div>
          <h1>UPLOAD YOUR MEDICAL REPORT & GET INSTANT INSIGHTS</h1>
          <p>
            "Easily upload your health reports and let our AI analyze them in
            seconds, providing you with clear, simplified insights."
          </p>
        </div>

        <div className="mainSection">
          <div className="mainSection_uploadReport">
            <div className="titleAndParagraph">
              <h2>Upload Reports</h2>
              <p>Please attach a lab report to proceed</p>
            </div>

            <div
              className="dragAndUploadFile"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="dragAndUploadFile_img">
                <img src="/images/image 6.png" alt="" />
              </div>
              <p>
                {selectedFileName
                  ? `Selected File: ${selectedFileName}`
                  : "Drag & Drop your file here"}
              </p>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            <p className="border"></p>

            <button onClick={handleAnalyzeReport}>Analyze Report</button>
            {showNoFileSelected && (
              <p className="noFileSelected_message">No File Selected</p>
            )}
          </div>

          <div className="mainSection_guide">
            <h2>Guide to upload report</h2>
            <div className="subPart">
              <div className="subPart_image">
                <img src="/images/image 31.png" alt="" />
              </div>
              <div className="subPart_list">
                <ul>
                  <li>Click the "Upload Report" button to select a file.</li>
                  <li>Ensure your file is in PDF, JPG, or PNG format.</li>
                  <li>Click "Analyze Report" to process your liver health data.</li>
                  <li>
                    Receive a simplified summary, including values like ALT, AST,
                    ALP, and Bilirubin levels to help you understand your liver
                    function.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {showLoader && <span ref={sectionRef} className="loader"></span>}

        {condition && smartReport && (
          <AnalyzeReport report={smartReport} />
        )}
      </div>
    </>
  );
}
