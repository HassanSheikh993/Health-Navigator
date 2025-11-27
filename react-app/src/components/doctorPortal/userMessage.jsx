import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

export function UserMessage({ data, onDelete }) {
  const navigate = useNavigate();

  function handleOnClick() {
    navigate("/reportDetails", { state: { report: data } });
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    onDelete(data._id);
  }

  return (
    <div className="user_messages user-message-card" onClick={handleOnClick}>
      <h3>You've Got a New Report</h3>

      <h4>{data.patient_id?.name || "NaN"}</h4>

      <p>Date: {new Date(data.createdAt).toLocaleString() || "NaN"}</p>

      {/* Delete icon button */}
      <button
        className="deleteMessageBtn delete-icon-btn"
        onClick={handleDeleteClick}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
