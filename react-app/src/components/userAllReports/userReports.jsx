import React, { useEffect, useState } from "react";
import heartlogo from "../../assets/heartlogo.png";
import { deleteUserReport, displayReports } from "../../services/medicalReport";
import "../../Styles/userReport.css"
import { useNavigate } from "react-router-dom";
import Nav from "../../Health Navigator/Nav";
import Footer from "../../Health Navigator/Footer";
import { GenerateGraphs } from "./generateGraph";
import { ErrorMessage } from "./errorPopUp";


export function AllUserReport(){
return(
<>
  <Nav/>
  <UserReports/>
  <Footer/>
</>
)
}

 function UserReports() {
    const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [message, setMessage] = useState("");
  const [analyzeState,setAnalyzeState] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");


  // 
  function handleClosePopup() {
    setShowPopup(false);
  }
  useEffect(() => {
  if (selectedReports.length < 2) {
    setAnalyzeState(false);
  }
}, [selectedReports]);

  // 

// async function getAllReports() {
//   try {
 
//     const result = await displayReports();
 
   
//     if (!result || result.length === 0) {
//       setData([]);
//       setMessage("No reports available.");
//     } else {
//       setData(result);
//       setMessage("");
//     }

//   } catch (err) {
   
//     console.error("Error fetching reports:", err);
//     setData([]);
//     setMessage("Failed to fetch reports.");
//   }
// }

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

    if (
      error.response &&
      [400, 401, 404, 500].includes(error.response.status)
    ) {
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

  useEffect(()=>{
    console.log(selectedReports)
  },[selectedReports])


  // Checkbox handler
  const handleCheckboxChange = (report) => {
    setSelectedReports((prev) => {
      if (prev.some((r) => r._id === report._id)) {
        return prev.filter((r) => r._id !== report._id);
      } else {
        // add if not selected
        return [...prev, report];
      }
    });
  };

  //  async function handleDeleteReports(){
  //     if (selectedReports.length === 0) {
  //   setPopupMessage("Please select a file before deleting.");
  //   setShowPopup(true);
  //   return;
  // }
  //   const reportId = selectedReports.map((data)=>{
  //       return data._id
  //   });
  //   const result = await deleteUserReport(reportId);
  //     if (result && result.message) {
  //   setMessage(result.message);
  //   setSelectedReports([]);
  //   getAllReports();
  // }
  //  }

async function handleDeleteReports() {
  if (selectedReports.length === 0) {
    setPopupMessage("Please select a file before deleting.");
    setShowPopup(true);
    return;
  }

  const reportId = selectedReports.map((data) => data._id);
  setMessage(""); // reset old message

  try {
    const result = await deleteUserReport(reportId);
    console.log(result);

    if (result?.message) {
      setMessage(result.message);
      setSelectedReports([]);
      getAllReports();
    } else {
      setMessage("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Error deleting report:", error);

    if (
      error.response &&
      [400, 401, 404, 500].includes(error.response.status)
    ) {
      setMessage(error.response.data?.message || "Request failed");
    } else {
      setMessage("An unexpected error occurred. Please try again.");
    }
  }
}



   function handleSendReport(){
      if (selectedReports.length === 0) {
    setPopupMessage("Please select a report before sending.");
    setShowPopup(true);
    return;
  }
   
        setMessage("")
navigate("/contact-doctor", { state: { shareMode: true, selectedReports:selectedReports } });
        window.scrollTo(0, 0);
      
   }

   function handleAnalyzeReport(){
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
        <div key={report._id} className={`userReports_box ${selectedReports.some((r) => r._id === report._id) ? 'selected' : ''}`}>
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={selectedReports.some((r) => r._id === report._id)}
            onChange={() => handleCheckboxChange(report)}
          />

          {/* Content container */}
          <div className="userReports_content">
            {/* Report Path */}
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

            {/* Simplified Report */}
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

            {/* Date & Time */}
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
    <button className="userReport_deleteButton" onClick={handleDeleteReports}>Delete</button>
    <button className="userReport_SendButton" onClick={handleSendReport}>Send Report</button>
    <button className="userReport_analyzeButton" onClick={handleAnalyzeReport} >Azalyze Trends</button>
</div>
{/* <p className="userReport_deleteMessage">
    {message && <p>{message}</p>}
</p> */}

{
  analyzeState && <GenerateGraphs selectedReports={selectedReports}/>
}


   <ErrorMessage 
  isOpen={showPopup} 
  onClose={handleClosePopup} 
  message={popupMessage}
/>
    </>
  );
}
