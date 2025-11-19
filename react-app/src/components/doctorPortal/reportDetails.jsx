import { useLocation } from "react-router-dom";
import { useState } from "react";
import "../../Styles/reportDetails.css"
import Footer from "../../Health Navigator/Footer";
import Nav from "../../Health Navigator/Nav";
import { addDoctorReview } from "../../services/doctor";

export function ReportDetails() {
  return (
    <>
      <Nav />
      <Report />
      <Footer />
    </>
  )
}

export function Report() {
  const { state } = useLocation();
  const report = state?.report;

  const [review, setReview] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [loading, setLoading] = useState(false); // NEW: Disable while sending

  if (!report) {
    return <p className="reportDetails__noData">No Report Data Found</p>;
  }

  const patient = report.patient_id || {};
  const reportFile = report.report_id || {};

  async function handleReviewSend() {
    try {
      setLoading(true); // disable button

      const result = await addDoctorReview(
        review,
        report.doctor_email,
        report.patient_id,
        report.report_id._id
      );

      if (result?.message) {
        setReviewMessage(result.message);
      }

      // Auto-refresh UI after 1 sec
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("Error sending doctor review:", error);
      setReviewMessage("Failed to send review.");
    } finally {
      setLoading(false);
    }
  }

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
          <h4 className="reportDetails__fileLabel">Smart Report</h4>
          {reportFile.smartReport ? (
            <a
              className="reportDetails__fileLink"
              href={`http://localhost:8000/${reportFile.smartReport}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Smart Report
            </a>
          ) : (
            <p className="reportDetails__fileMissing">Smart Report: NaN</p>
          )}
        </div>
      </div>

      {/* Doctor Review */}
     <div className="reportDetails__review">
        <h3 className="reportDetails__reviewTitle">Doctor Review</h3>

        {/* If doctor ALREADY reviewed */}
        {report.doctor_review ? (
          <>
            <p className="doctorReviewText">
              <strong>Your Feedback:</strong> {report.doctor_review}
            </p>

            {/* Patient Rating Section */}
            {report.patient_rating ? (
              <div className="patientRatingBox">
                <p><strong>Patient Rating:</strong></p>

                {/* Star UI */}
                <div className="star-display">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="star"
                      style={{
                        color: star <= report.patient_rating ? "gold" : "#ccc"
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {report.patient_review && (
                  <p className="patientReviewText">
                    <strong>Patient Comment:</strong> {report.patient_review}
                  </p>
                )}
              </div>
            ) : (
              <p className="noRatingYet">Patient has not rated your feedback yet.</p>
            )}
          </>
        ) : (
          <>
            {/* If doctor has NOT reviewed yet */}
            <textarea
              className="reportDetails__textarea"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your feedback here..."
            />

            <button
              className="reportDetails__button"
              onClick={handleReviewSend}
              disabled={loading}     // 🔥 disabled while sending
            >
              {loading ? "Sending..." : "Send Review"}
            </button>
          </>
        )}
      </div>

      {reviewMessage && <p className="successMessage">{reviewMessage}</p>}
    </div>
  );
}



