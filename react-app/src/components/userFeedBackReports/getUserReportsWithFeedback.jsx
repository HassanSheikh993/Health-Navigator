import { useState, useEffect } from "react";
import { getUserReportsWithFeedback } from "../../services/medicalReport";
import "../../Styles/UserReportsWithFeedback.css"
import Nav from "../../Health Navigator/Nav";
import Footer from "../../Health Navigator/Footer";
import { RatingSection } from "../userFeedBackReports/RatingSection";
export function MainUserReportsWithFeedback() {
  return (
    <>
      <Nav />
      <UserReportsWithFeedback />
      <Footer />
    </>
  )
}
export function UserReportsWithFeedback() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all"); // all | reviewed | unreviewed

  async function getData() {
    try {
      const result = await getUserReportsWithFeedback();
      console.log("BBBB: ", result)

      if (!result || result.length === 0) {
        setData([]);
        setMessage("No Data Available");
      } else {
        setData(result);
        setMessage("");
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setMessage("Error fetching data");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // filter logic
  const filteredData = data.filter((item) => {
    if (filter === "reviewed") return item.viewedByDoctor === true;
    if (filter === "unreviewed") return item.viewedByDoctor === false;
    return true; // all
  });

  return (
    <div className="userReportFeedBack_container">
      <h2 className="userReportFeedBack_heading">User Reports With Feedback</h2>

      {/* Buttons */}
      <div className="userReportFeedBack_filters">
        <button
          className="userReportFeedBack_button"
          onClick={() => setFilter("all")}
        >
          All Reports
        </button>
        <button
          className="userReportFeedBack_button"
          onClick={() => setFilter("reviewed")}
        >
          Reviewed Reports
        </button>
        <button
          className="userReportFeedBack_button"
          onClick={() => setFilter("unreviewed")}
        >
          Unreviewed Reports
        </button>
      </div>

      {/* Message if error or no data */}
      {message && <p className="userReportFeedBack_message">{message}</p>}

      {/* Reports */}
      {filteredData.map((item) => {
        const doctor = item.doctor_id || {};
        const report = item.report_id || {};

        const doctorImage = doctor.picture
          ? `http://localhost:8000${doctor.picture}`
          : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

        return (
          <div key={item._id} className="userReportFeedBack_card">
            {/* Doctor Info */}
            <img
              src={doctorImage}
              alt="Doctor"
              width="80"
              className="userReportFeedBack_doctorImg"
            />
            <p className="userReportFeedBack_doctorName">
              <strong>Name:</strong> {doctor.name}
            </p>
            <p className="userReportFeedBack_doctorEmail">
              <strong>Email:</strong> {doctor.email}
            </p>

            {/* Report Link */}
            {report.reportPath && (
              <button
                className="userReportFeedBack_viewReportButton"
                onClick={() =>
                  window.open(
                    `http://localhost:8000${report.reportPath}`,
                    "_blank"
                  )
                }
              >
                View Report
              </button>
            )}

            {/* Feedback & Time (only if reviewed) */}
            {item.viewedByDoctor && (
              <>
                <p className="userReportFeedBack_feedback">
                  <strong>Doctor Feedback:</strong> {item.doctor_review}
                </p>
                <p className="userReportFeedBack_reviewedAt">
                  <strong>Reviewed At:</strong>{" "}
                  {new Date(item.updatedAt).toLocaleString()}
                </p>
              </>
            )}
            {/* ⭐ Patient Rating System */}
            {item.viewedByDoctor && (
              <RatingSection item={item} refresh={getData} />
            )}
          </div>
        );
      })}
    </div>
  );
}
