import { useState, useRef, useEffect } from "react";
import { AnalyzeReport } from "./analysisReport";
import "../../styles/UploadReport.css";
import { uploadMedicalReport } from "../../services/medicalReport";

export function UploadReport() {
  const [condition, setCondition] = useState(null); // will hold markdown report
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectFileUpload, setSelectFileUpload] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const sectionRef = useRef(null);
  const [showNoFileSelected, setShowNoFileSelected] = useState(false);

  // ✅ Handle File Change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectFileUpload(selectedFile);
      setSelectedFileName(selectedFile.name);
      setShowNoFileSelected(false);
      console.log("Uploaded file:", selectedFile.name);
    }
  };

  useEffect(() => {
    if (selectFileUpload) {
      console.log("Updated selected file:", selectFileUpload);
    }
  }, [selectFileUpload]);

  // ✅ Handle Analyze Button
  async function handleAnalyzeReport() {
    if (!selectFileUpload) {
      setShowNoFileSelected(true);
      return;
    }

    setShowLoader(true);
    setCondition(null);

    try {
      console.log("📤 Uploading report to backend...");
      const result = await uploadMedicalReport(selectFileUpload);
      console.log("📥 Backend smart report result:", result);

      if (result.success && result.report?.report) {
        setCondition(result.report.report); // markdown string from backend
      } else {
        alert("⚠️ Failed to generate report. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error uploading file:", err);
      alert("Something went wrong while generating the report.");
    } finally {
      setShowLoader(false);
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }

  return (
    <>
      <div>
        {/* HERO SECTION */}
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

        {/* MAIN SECTION */}
        <div className="mainSection">
          {/* LEFT - UPLOAD */}
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

          {/* RIGHT - GUIDE */}
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
                  <li>Click "Analyze Report" to process your health data.</li>
                  <li>
                    Receive a simplified summary, including key insights like
                    ALT, AST, and Bilirubin levels.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* LOADER */}
        {showLoader && selectFileUpload && (
          <div ref={sectionRef} className="loader-container">
            <span className="loader"></span>
            <p>Generating Smart Report...</p>
          </div>
        )}

        {/* REPORT DISPLAY */}
        {condition && !showLoader && (
          <div ref={sectionRef}>
            <AnalyzeReport report={condition} />
          </div>
        )}
      </div>
    </>
  );
}
