import { useLocation } from "react-router-dom";
import { useState } from "react";
import "../../Styles/reportDetails.css"
import Footer from "../../Health Navigator/Footer";
import Nav from "../../Health Navigator/Nav";
import { addDoctorReview } from "../../services/medicalReport";

export function ReportDetails(){
return(
    <>
    <Nav/>
<Report/>
<Footer/>
    </>
)
}

export function Report() {
  const { state } = useLocation();
  const report = state?.report;

  const [review, setReview] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  if (!report) {
    return <p className="reportDetails__noData">No Report Data Found</p>;
  }

  const patient = report.patient_id || {};
  const reportFile = report.report_id || {};


  // async function handleReviewSend(){

  //     const result = await addDoctorReview(review,report.doctor_email,report.patient_id,report.report_id._id);
  //     setReviewMessage(result.message);
  // }



  async function handleReviewSend() {
  try {
    const result = await addDoctorReview(
      review,
      report.doctor_email,
      report.patient_id,
      report.report_id._id
    );

    if (result && result.message) {
      setReviewMessage(result.message);
    } else {
      setReviewMessage("Unexpected response from the server.");
    }
  } catch (error) {
    console.error("Error sending doctor review:", error);

    if (
      error.response &&
      [400, 401, 404, 500].includes(error.response.status)
    ) {
      setReviewMessage(
        error.response.data?.message || "Failed to send review."
      );
    } else {
      setReviewMessage("An unexpected error occurred. Please try again.");
    }
  }
}




// async function handleReviewSend() {
//   try {
//     const result = await addDoctorReview(
//       review,
//       report.doctor_email,
//       report.patient_id,
//       report.report_id._id
//     );

//     if (result?.message) {
//       setReviewMessage(result.message);
//     } else {
//       setReviewMessage("Unexpected response from server.");
//     }
//   } catch (error) {
//     console.error("Error sending review:", error);

//     if (
//       error.response &&
//       [400, 401, 404, 500].includes(error.response.status)
//     ) {
//       setReviewMessage(error.response.data?.message || "Failed to send review.");
//     } else {
//       setReviewMessage("An unexpected error occurred. Please try again.");
//     }
//   }
// }





  return (
    <div className="reportDetails__container">
      <h2 className="reportDetails__title">Report Details</h2>

      {/* Patient Info */}
      <div className="reportDetails__patientInfo">
        <img
          className="reportDetails__patientImage"
          src={
            patient.picture
              ? `http://localhost:8000${patient.picture}`
              : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
          }
          alt="Patient"
          width="100"
        />
        <p className="reportDetails__patientName">
          Name: {patient.name || "NaN"}
        </p>
        <p className="reportDetails__patientEmail">
          Email: {patient.email || "NaN"}
        </p>
        <p className="reportDetails__date">
          Date: {new Date(report.createdAt).toLocaleString() || "NaN"}
        </p>
      </div>

      {/* Report Files */}
      <div className="reportDetails__files">
        <h3 className="reportDetails__filesTitle">Report Files</h3>

        <div className="reportDetails__fileBlock">
          <h4 className="reportDetails__fileLabel">Original Report</h4>
          {reportFile.reportPath ? (
            <a
              className="reportDetails__fileLink"
              href={`http://localhost:8000/${reportFile.reportPath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Report
            </a>
          ) : (
            <p className="reportDetails__fileMissing">Report File: NaN</p>
          )}
        </div>

        <div className="reportDetails__fileBlock">
          <h4 className="reportDetails__fileLabel">Simplified Report</h4>
          {reportFile.simplifiedReport ? (
            <a
              className="reportDetails__fileLink"
              href={`http://localhost:8000/${reportFile.simplifiedReport}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Simplified Report
            </a>
          ) : (
            <p className="reportDetails__fileMissing">Simplified Report: NaN</p>
          )}
        </div>
      </div>

      {/* Doctor Review */}
      <div className="reportDetails__review">
        <h3 className="reportDetails__reviewTitle">Doctor Review</h3>
        <textarea
          className="reportDetails__textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
        />
        <br />
        <button
          className="reportDetails__button"
          onClick={handleReviewSend}
        >
          Send Review
        </button>
      </div>
      {reviewMessage && <p>{reviewMessage}</p>}
    </div>
  );
}


