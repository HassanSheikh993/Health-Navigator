import { useState, useEffect } from "react";
import { doctorReviewHistory } from "../../services/medicalReport";
import "../../Styles/showDoctorHistory.css"
import Nav from "../../Health Navigator/Nav";
import Footer from "../../Health Navigator/Footer";

export function DoctorHistory(){
  return(
 <>
    <Nav/>
    <ShowDoctorHistory/>
    <Footer/>
 </>
  )
}


export function ShowDoctorHistory() {
  const [data, setData] = useState([]);
  const [message,setMessage] = useState("");

//   async function fetchData() {
//     try {
//       const result = await doctorReviewHistory();
//       if(!result || result.length===0){
//         setData([])
//         setMessage("No history found.")
//       }else{
// setData(result); 
// setMessage("")
//       }
      
//     } catch (err) {
//       console.error("Error fetching doctor history:", err);
//     }
//   }




async function fetchData() {
  try {
    const result = await doctorReviewHistory();
    console.log(result);

    if (!result || result.length === 0) {
      setData([]);
      setMessage("No history found.");
    } else {
      setData(result);
      setMessage("");
    }
  } catch (error) {
    console.error("Error fetching doctor history:", error);

    if (
      error.response &&
      [400, 401, 404, 500].includes(error.response.status)
    ) {
      setMessage(error.response.data?.message || "Failed to load history.");
    } else {
      setMessage("An unexpected error occurred. Please try again.");
    }

    setData([]);
  }
}




  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="doctorHistory__container">
      <h2 className="doctorHistory__heading">Doctor Review History</h2>
      {data.length === 0 ? (
        <p className="doctorHistory__noData">{message}</p>
      ) : (
        data.map((item) => {
          const patient = item.patient_id || {};
          const report = item.report_id || {};

          return (
            <div key={item._id} className="doctorHistory__card">
              {/* Patient Info */}
              <img
                className="doctorHistory__patientImage"
                src={
                  patient.picture
                    ? `http://localhost:8000${patient.picture}`
                    : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                }
                alt="Patient"
                width="80"
              />
              <p className="doctorHistory__patientName">
                <strong>Name:</strong> {patient.name || "NaN"}
              </p>
              <p className="doctorHistory__patientEmail">
                <strong>Email:</strong> {patient.email || "NaN"}
              </p>

              {/* Report File */}
              <p className="doctorHistory__report">
                <strong>Report:</strong>{" "}
                {report.reportPath ? (
                  <a
                    className="doctorHistory__reportLink"
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

              {/* Doctor Review */}
              <p className="doctorHistory__review">
                <strong>Doctor Review:</strong>{" "}
                {item.doctor_review || "NaN"}
              </p>

              {/* Date & Time */}
              <p className="doctorHistory__date">
                <strong>Reviewed At:</strong>{" "}
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleString()
                  : "NaN"}
              </p>

              <hr className="doctorHistory__divider" />
            </div>
          );
        })
      )}
    </div>
  );
}
