import { useState } from "react";
import "../../Styles/RatingSection.css";
import { rateDoctorFeedback } from "../../services/medicalReport";
export function RatingSection({ item, refresh }) {
  const [rating, setRating] = useState(item.patient_rating || 0);
  const [review, setReview] = useState(item.patient_review || "");
  const [loading, setLoading] = useState(false);

  const alreadyRated = item.patient_rating !== null;

  async function handleSubmit() {
    if (!rating) return alert("Please select rating 1–5");

    try {
      setLoading(true);
      await rateDoctorFeedback(item._id, rating, review);
      alert("Rating submitted successfully!");
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ratingBox">
      <h4>Rate Doctor Feedback</h4>

      {/* ⭐ Star Input */}
      <div className="starRating">
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            className={`star ${rating >= num ? "filled" : ""} ${alreadyRated ? "disabled" : ""}`}
            onClick={() => !alreadyRated && setRating(num)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Review Textarea */}
      <textarea
        className="reviewBox"
        placeholder="Write your review (optional)"
        value={review}
        disabled={alreadyRated}
        onChange={(e) => setReview(e.target.value)}
      />

      {/* Already Rated → No Button */}
      {alreadyRated ? (
        <p className="alreadyRatedNote">You rated this feedback on {new Date(item.ratedAt).toLocaleString()}</p>
      ) : (
        <button className="submitRatingBtn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Rating"}
        </button>
      )}
    </div>
  );
}
