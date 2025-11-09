

import { useNavigate } from "react-router-dom";

export function UserMessage({ data }) {
  const navigate = useNavigate();

  function handleOnClick() {
    // Navigate to ReportDetails and send data with state
    navigate("/reportDetails", { state: { report: data } });
  }

  return (
    <div className="user_messages" onClick={handleOnClick}>
      <h3>You've Got a New Report</h3>
      <h4>{data.patient_id?.name || "NaN"}</h4>
      <p>Date: {new Date(data.createdAt).toLocaleString() || "NaN"}</p>
    </div>
  );
}
