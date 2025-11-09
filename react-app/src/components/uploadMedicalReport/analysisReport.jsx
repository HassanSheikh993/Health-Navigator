import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../styles/UploadReport.css";
import { SaveReportPopup } from "./saveReportPopUp";
import { SignInPopUp } from "../signInToContinue/signInPopUp";
import { loginUserData } from "../../services/api";

export function AnalyzeReport({ report }) {
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setLoginData] = useState(null);

  async function fetchUser() {
    const result = await loginUserData();
    if (!result || result.message) setLoginData(null);
    else setLoginData(result);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  function handleSave() {
    setShowPopup(true);
  }
  function handleClosePopup() {
    setShowPopup(false);
  }

  return (
    <div className="AIGeneratedAnalysis_container">
      <h2>AI-GENERATED ANALYSIS RESULTS</h2>

      <div className="AIGeneratedAnalysis_resultBox">
        <div className="report-container markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report}
          </ReactMarkdown>
        </div>
      </div>

      <div className="AIGeneratedAnalysis_shareButton">
        <p>Keep a Copy of Your Report – Save Now!</p>
        <button onClick={handleSave}>Save</button>
      </div>

      {userData && (
        <SaveReportPopup
          isOpen={showPopup}
          onClose={handleClosePopup}
          report={report}
        />
      )}
      {!userData && showPopup && (
        <SignInPopUp isOpen={showPopup} onClose={handleClosePopup} />
      )}
    </div>
  );
}
