import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AnswerPopup from "../components/AnswerPopup";
import { API_BASE } from "../config";

const Dashboard = () => {
  const { user, token, logout, updateSubmissionStatus } = useAuth();

  const [clues, setClues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const hasSubmitted = user?.hasSubmitted ?? false;

  useEffect(() => {
    const fetchClues = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/game/clues`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          logout();
          return;
        }

        const data = await res.json();

        if (data.success) {
          setClues(data.clues || []);
        } else {
          setFetchError("FAILED_TO_LOAD_INTEL — CONTACT_HQ");
        }
      } catch {
        setFetchError("TERMINAL_OFFLINE — RETRYING...");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchClues();
  }, [token, logout]);

  const handleSubmitSuccess = (answerString) => {
    updateSubmissionStatus(answerString);
    setShowPopup(false);
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ paddingTop: "56px" }}>
        <p className="loading-text">SYNCHRONIZING_OPERATIVE_DATA...</p>
      </div>
    );
  }

  return (
    <>
      {showPopup && (
        <AnswerPopup
          onClose={() => setShowPopup(false)}
          onSuccess={handleSubmitSuccess}
        />
      )}

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
            CLUES_LOADED<span>{clues.length}</span>
          </div>

          {hasSubmitted && (
            <div className="submitted-badge">✓ FINAL_ANSWER_SUBMITTED</div>
          )}
        </aside>

        <section className="intel-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title cinzel">ACTIVE_MISSIONS</h2>
              <p className="panel-sub">
                Solve each clue — combine answers to unlock the vault.
              </p>

              {user?.submittedAnswer && (
                <p
                  className="auth-success"
                  style={{ marginTop: "1rem", display: "inline-block" }}
                >
                  CURRENT TARGET: {user.submittedAnswer}
                </p>
              )}
            </div>
            <button
              className="final-submit-btn"
              onClick={() => setShowPopup(true)}
            >
              {hasSubmitted ? "[ OVERRIDE_ANSWER ]" : "[ SUBMIT_FINAL_ANSWER ]"}
            </button>
          </div>

          {fetchError && (
            <p className="popup-error" style={{ marginBottom: "1.5rem" }}>
              ⚠ {fetchError}
            </p>
          )}

          <div className="clues-list">
            {clues.length > 0 ? (
              clues.map((clue, idx) => (
                <div key={clue.id ?? idx} className="clue-card">
                  <span className="clue-number">
                    CLUE — #{String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="clue-text">{clue.text}</p>
                </div>
              ))
            ) : (
              <div className="no-clues">
                <p>NO_INTEL_LOADED. CONTACT_HQ.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
