import "../../styles/doctorDashboard.css"
import { NotificationBox } from "./notificationBox";
import { UserMessage } from "./userMessage";

export function DoctorDashBoard() {
  return (
    <>
      <div className="DoctorDashBoard_container">
        <h1 className="DoctorDashBoard_container_h1">Doctor Dashboard</h1>
        <div className="top_part">
         <NotificationBox message={"Today's"} data={10}/>
         <NotificationBox message={"Monthly"} data={20}/>
          
        </div>
      </div>
    </>
  );
}

export function MessageSendByUserToPatient() {
  return (
    <>
      <div className="message_user_to_dr_container">
        <h3>Ensure timely review to provide the best care possible.</h3>
        <h4>All Messages</h4>

        <div className="message_user_to_dr_messages">
          <UserMessage data={"Hassan"} />
          <UserMessage data={"Haseeb"} />
          <UserMessage data={"Ifrah"} />
          <UserMessage data={"Hassan"} />
          <UserMessage data={"Haseeb"} />
          <UserMessage data={"Ifrah"} />
        </div>
      </div>
    </>
  );
}
