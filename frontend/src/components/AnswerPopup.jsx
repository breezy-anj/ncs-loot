import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config";

/**
 * AnswerPopup
 * Props:
 * onClose   – called when the user dismisses the popup
 * onSuccess – called when the answer is successfully submitted
 */
const AnswerPopup = ({ onClose, onSuccess }) => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // Get token securely from context
  const { token } = useAuth();

  const handleSubmit = async () => {
    const trimmed = answer.trim();
    if (!trimmed) {
      setError("ANSWER_FIELD_EMPTY");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/game/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Used context token here
        },
        body: JSON.stringify({ finalAnswer: trimmed }),
      });

      const data = await res.json();

      if (data.success) {
        setConfirmed(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(data.message || "SUBMISSION_FAILED — RETRY");
      }
    } catch {
      setError("TERMINAL_OFFLINE — CHECK_CONNECTION");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="popup-overlay"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div className="popup-card">
        <h2 className="popup-title cinzel">SUBMIT_FINAL_ANSWER</h2>

        <p className="popup-note">
          Combine all clue answers in order, separated by a dash.
          <br />
          <strong>FORMAT: answer1-answer2-answer3</strong>
        </p>

        {confirmed ? (
          <div className="popup-confirmed">
            <span className="popup-confirmed-icon">✓</span>
            <p className="popup-confirmed-text cinzel">ANSWER_LOCKED_IN</p>
            <p className="popup-confirmed-sub">
              Your submission has been recorded.
            </p>
          </div>
        ) : (
          <>
            {error && <p className="popup-error">⚠ {error}</p>}

            <input
              className="popup-input"
              type="text"
              placeholder="ENTER_YOUR_ANSWER_HERE..."
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
              autoFocus
            />

            <div className="popup-actions">
              <button
                className="popup-submit-btn cinzel"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "TRANSMITTING..." : "LOCK_IN_ANSWER"}
              </button>

              <button
                className="popup-abort-btn"
                onClick={onClose}
                disabled={loading}
              >
                [ ABORT_MISSION ]
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnswerPopup;
