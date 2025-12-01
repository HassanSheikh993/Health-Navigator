import React, { useEffect, useState } from "react";
import heartlogo from "../../assets/heartlogo.png";
import { deleteUserReport, displayReports } from "../../services/medicalReport";
import "../../Styles/userReport.css";
import { useNavigate } from "react-router-dom";
import Nav from "../../Health Navigator/Nav";
import Footer from "../../Health Navigator/Footer";
import { GenerateGraphs } from "./generateGraph";
import { ErrorMessage } from "./errorPopUp";
import toast from "react-hot-toast";

export function AllUserReport() {
  return (
    <>
      <Nav />
      <UserReports />
      <Footer />
    </>
  );
}

function UserReports() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [message, setMessage] = useState("");
  const [analyzeState, setAnalyzeState] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  function handleClosePopup() {
    setShowPopup(false);
  }

  useEffect(() => {
    if (selectedReports.length < 2) {
      setAnalyzeState(false);
    }
  }, [selectedReports]);

  async function getAllReports() {
    try {
      const result = await displayReports();
      console.log(result);

      if (!result || result.length === 0) {
        setData([]);
        setMessage("No reports available.");
      } else {
        setData(result);
        setMessage("");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);

      if (error.response && [400, 401, 404, 500].includes(error.response.status)) {
        setMessage(error.response.data?.message || "Failed to fetch reports.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }

      setData([]);
    }
  }

  useEffect(() => {
    getAllReports();
  }, []);

  useEffect(() => {
    console.log(selectedReports);
  }, [selectedReports]);

  const handleCheckboxChange = (report) => {
    setSelectedReports((prev) => {
      if (prev.some((r) => r._id === report._id)) {
        return prev.filter((r) => r._id !== report._id);
      } else {
        return [...prev, report];
      }
    });
  };

  // -------------------------------
  // DELETE FUNCTION + SUCCESS TOAST
  // -------------------------------
  async function handleDeleteReports() {
    if (selectedReports.length === 0) {
      setPopupMessage("Please select a file before deleting.");
      setShowPopup(true);
      return;
    }

    const reportId = selectedReports.map((data) => data._id);
    setMessage("");

    try {
      const result = await deleteUserReport(reportId);
      console.log(result);

      if (result?.message) {
        setMessage(result.message);
        setSelectedReports([]);
        getAllReports();

        // ✅ SUCCESS TOAST ADDED (TOP CENTER)
        toast.success("Report(s) deleted successfully!", {
          position: "top-center",
        });

      } else {
        setMessage("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error deleting report:", error);

      if (error.response && [400, 401, 404, 500].includes(error.response.status)) {
        setMessage(error.response.data?.message || "Request failed");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  }

  // DELETE CONFIRM POPUP
  const confirmDelete = () => {
    if (selectedReports.length === 0) {
      setPopupMessage("Please select a file before deleting.");
      setShowPopup(true);
      return;
    }

    toast((t) => (
      <div className="toast-confirm">
        <p>Are you sure you want to delete selected report(s)?</p>

        <div className="toast-buttons">
          <button className="btn-cancel" onClick={() => toast.dismiss(t.id)}>
            Cancel
          </button>

          <button
            className="btn-delete"
            onClick={async () => {
              toast.dismiss(t.id);
              await handleDeleteReports();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  function handleSendReport() {
    if (selectedReports.length === 0) {
      setPopupMessage("Please select a report before sending.");
      setShowPopup(true);
      return;
    }

    setMessage("");
    navigate("/contact-doctor", { state: { shareMode: true, selectedReports } });
    window.scrollTo(0, 0);
  }

  function handleAnalyzeReport() {
    if (selectedReports.length < 2 || selectedReports.length > 3) {
      setPopupMessage("You must select at least 2 and at most 3 reports to analyze.");
      setShowPopup(true);
      return;
    }
    setAnalyzeState(true);
  }

  return (
    <>
      <div className="coverbanner">
        <div className="heartimg">
          <img src={heartlogo} alt="logo" />
        </div>
        <div className="coverheading">
          <h2>"TRACK YOUR LIVER HEALTH TRENDS AND PROGRESS"</h2>
          <p>
            "Monitor your liver function over time with easy-to-read graphs and
            insights. Stay informed about changes in your health and take
            proactive steps towards better well-being."
          </p>
        </div>
      </div>

      <div className="userReports container">
        {data.length === 0 ? (
          <p>{message}</p>
        ) : (
          data.map((report) => {
            const user = report.user || {};

            return (
              <div
                key={report._id}
                className={`userReports_box ${
                  selectedReports.some((r) => r._id === report._id) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedReports.some((r) => r._id === report._id)}
                  onChange={() => handleCheckboxChange(report)}
                />

                <div className="userReports_content">
                  <p>
                    <strong>Report:</strong>{" "}
                    {report.reportPath ? (
                      <a
                        href={`http://localhost:8000/${report.reportPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open File
                      </a>
                    ) : (
                      "NaN"
                    )}
                  </p>

                  <p>
                    <strong>Simplified Report:</strong>{" "}
                    {report.smartReport ? (
                      <a
                        href={`http://localhost:8000/${report.smartReport}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open File
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </p>

                  <p>
                    <strong>Created At:</strong>{" "}
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : "NaN"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="userReports_buttons">
        <button className="userReport_deleteButton" onClick={confirmDelete}>
          Delete
        </button>
        <button className="userReport_SendButton" onClick={handleSendReport}>
          Send Report
        </button>
        <button className="userReport_analyzeButton" onClick={handleAnalyzeReport}>
          Analyze Trends
        </button>
      </div>

      {analyzeState && <GenerateGraphs selectedReports={selectedReports} />}

      <ErrorMessage
        isOpen={showPopup}
        onClose={handleClosePopup}
        message={popupMessage}
      />
    </>
  );
}
