import "../../styles/doctorDashboard.css"
import { NotificationBox } from "./notificationBox";
import { UserMessage } from "./userMessage";
import { getAllReportsForDoctor } from "../../services/medicalReport";
import { useEffect, useState } from "react";
import { getReportStats } from "../../services/medicalReport";
import { useNavigate } from "react-router-dom";

export function DoctorDashBoard() {
  const [reportStats,setReportStats] = useState();
  const [message,setMessage] = useState("");

  // async function getReportsCount(){
  //   const result = await getReportStats();
  //   setReportStats(result);

  // }



  async function getReportsCount() {
  try {
    const result = await getReportStats();
    console.log(result);

    if (!result || (result.today === 0 && result.month === 0)) {
      setReportStats({ today: 0, month: 0 });
      setMessage("No report stats available.");
    } else {
      setReportStats(result);
      setMessage("");
    }
  } catch (error) {
    console.error("Error fetching report stats:", error);

    if (
      error.response &&
      [400, 401, 404, 500].includes(error.response.status)
    ) {
      setMessage(error.response.data?.message || "Failed to load report stats.");
    } else {
      setMessage("An unexpected error occurred. Please try again.");
    }

    setReportStats({ today: 0, month: 0 });
  }
}






  useEffect(()=>{
getReportsCount();
  },[])

  useEffect(()=>{
console.log("STATUS: ",reportStats)
  },[reportStats])

  return (
    <>
      <div className="DoctorDashBoard_container">
        <h1 className="DoctorDashBoard_container_h1">Doctor Dashboard</h1>
        <div className="top_part">
      <NotificationBox message={"Today's"} data={reportStats?.today || 0} />
  <NotificationBox message={"Monthly"} data={reportStats?.month || 0} />

     {/* <NotificationBox message={"Today's"} data={reportStats} />
  <NotificationBox message={"Monthly"} data={reportStats} /> */}
          
        </div>
        {message && <p className="DoctorDashBoard_message">{message}</p>}
      </div>
    </>
  );
}

export function MessageSendByUserToPatient() {
  const navigator = useNavigate()

    const [reports,setReport] = useState([]);
    const [errorMessage,setErrorMessage] = useState("");

  // async function getReports(){
  //  const response = await getAllReportsForDoctor();
  //  console.log(response)
  
  //  if(response.message){
  //   setErrorMessage(response.message);
  //  }else{
  //    setReport(response);
  //  }
  // }


  async function getReports() {
  try {
    const response = await getAllReportsForDoctor();
    console.log(response);

    if (response?.message) {
      setErrorMessage(response.message);
    } else {
      setReport(response);
      setErrorMessage("");
    }
  } catch (error) {
    console.error("Error fetching reports for doctor:", error);

    if (
      error.response &&
      [400, 401, 404, 500].includes(error.response.status)
    ) {
      setErrorMessage(error.response.data?.message || "Failed to load reports.");
    } else {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  }
}


  useEffect(()=>{
  getReports();
  },[])


 useEffect(() => {
  console.log("Reports updated:", reports);
}, [reports]);



function handleShowHistory(){
  navigator("/showDoctorHistory")
}

  return (
    <>
      <div className="message_user_to_dr_container">
       <div className="MessageSendByUserToPatient_box">
        <div className="MessageSendByUserToPatient_heading">
         <h3>Ensure timely review to provide the best care possible.</h3>
        <h4>All Messages</h4>
       </div>

        <button className="MessageSendByUserToPatient_button" onClick={handleShowHistory}>History</button>
       </div>

        {/* <div className="message_user_to_dr_messages">

         {
  reports.map((data) => (
     <UserMessage key={data._id} data={data} />
  ))
}

        </div> */}



{
  errorMessage ? <p>{errorMessage}</p> :         <div className="message_user_to_dr_messages">

         {
  reports.map((data) => (
     <UserMessage key={data._id} data={data} />
  ))
}

        </div>
}






      </div>
    </>
  );
}
