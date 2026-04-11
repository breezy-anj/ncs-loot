import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config";

const Dashboard = () => {
  const { user, token, logout } = useAuth();

  const [currentClue, setCurrentClue] = useState(null);
  const [level, setLevel] = useState(0);
  const [completed, setCompleted] = useState(false);

  const [answerInput, setAnswerInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchCurrentClue = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/game/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return logout();

      const data = await res.json();
      if (data.success) {
        if (data.completed) {
          setCompleted(true);
        } else {
          setCurrentClue(data.clue);
          setLevel(data.level);
        }
      } else {
        setError("FAILED_TO_LOAD_INTEL");
      }
    } catch {
      setError("TERMINAL_OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCurrentClue();
  }, [token]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    setLoading(true);
    setFeedback("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/game/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answer: answerInput }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.correct) {
          setAnswerInput("");
          setFeedback(data.message);
          setTimeout(() => {
            setFeedback("");
            fetchCurrentClue();
          }, 1500);
        } else {
          setError(data.message);
        }
      }
    } catch {
      setError("CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentClue) {
    return (
      <div className="loading-screen" style={{ paddingTop: "56px" }}>
        <p className="loading-text">SYNCHRONIZING_OPERATIVE_DATA...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-status">
          <span className="status-dot" /> OPERATIVE_ONLINE
        </div>
        <p className="sidebar-name cinzel">{user?.zealId || "UNKNOWN"}</p>
        <div className="sidebar-divider" />
        <div className="sidebar-info">
          NAME<span>{user?.name || "REDACTED"}</span>
          ACCESS_LEVEL<span>OPERATIVE — 01</span>
          CURRENT_PHASE<span>{completed ? "COMPLETE" : level + 1}</span>
        </div>

        {completed && <div className="submitted-badge">✓ HUNT_COMPLETED</div>}
      </aside>

      <section className="intel-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title cinzel">ACTIVE_MISSION</h2>
            <p className="panel-sub">
              Decrypt the clue to reveal your next coordinate.
            </p>
          </div>
        </div>

        {completed ? (
          <div
            className="clue-card"
            style={{
              borderColor: "var(--neon)",
              boxShadow: "0 0 20px rgba(0,255,65,0.2)",
            }}
          >
            <span className="clue-number" style={{ color: "var(--neon)" }}>
              MISSION ACCOMPLISHED
            </span>
            <p className="clue-text">
              All decryption phases complete. Await further instructions from
              HQ.
            </p>
          </div>
        ) : currentClue ? (
          <div className="clue-card">
            <span className="clue-number">
              PHASE — #{String(level + 1).padStart(2, "0")}
            </span>
            <p className="clue-text">{currentClue.text}</p>

            <form onSubmit={handleVerify} style={{ marginTop: "2.5rem" }}>
              <input
                className="popup-input"
                type="text"
                value={answerInput}
                onChange={(e) => {
                  setAnswerInput(e.target.value);
                  setError("");
                }}
                placeholder="ENTER_DECRYPTION_KEY..."
                autoFocus
              />

              {error && <p className="popup-error">⚠ {error}</p>}
              {feedback && (
                <p className="auth-success" style={{ marginBottom: "0.8rem" }}>
                  ✓ {feedback}
                </p>
              )}

              <button
                type="submit"
                className="popup-submit-btn cinzel"
                disabled={loading}
              >
                {loading ? "VERIFYING..." : "SUBMIT_KEY"}
              </button>
            </form>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Dashboard;
