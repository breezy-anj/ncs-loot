import { useState, useEffect } from "react";
import { API_BASE } from "../config";

const Leaderboard = () => {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/game/leaderboard`);
        if (!res.ok) throw new Error("Network error or server unreachable");

        const data = await res.json();

        if (data.success) {
          setIsActive(data.active);
          setBoard(data.leaderboard || []);
        } else {
          setError("FAILED_TO_LOAD_STANDINGS");
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setError("TERMINAL_OFFLINE — CHECK CONNECTION");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen" style={{ paddingTop: "56px" }}>
        <p className="loading-text">DECRYPTING_RANKS...</p>
      </div>
    );
  }

  return (
    <div
      className="dashboard-wrapper"
      style={{ display: "block", padding: "5rem 2rem" }}
    >
      <div
        className="about-header"
        style={{ textAlign: "center", margin: "0 auto 3rem auto" }}
      >
        <h1 className="about-title cinzel">THE VAULT STANDINGS</h1>
      </div>

      {error ? (
        <p
          className="popup-error"
          style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}
        >
          ⚠ {error}
        </p>
      ) : !isActive || board.length === 0 ? (
        <div
          className="no-clues"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <p className="blink">NO QUALIFIED OPERATIVES FOUND YET.</p>
        </div>
      ) : (
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontFamily: "var(--mono)",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  color: "var(--neon-dim)",
                }}
              >
                <th style={{ padding: "1rem" }}>RANK</th>
                <th style={{ padding: "1rem" }}>OPERATIVE</th>
                <th style={{ padding: "1rem" }}>ROLL_NO</th>
                <th style={{ padding: "1rem" }}>PHASE</th>
                <th style={{ padding: "1rem" }}>LAST_SOLVE</th>
              </tr>
            </thead>
            <tbody>
              {board.map((user, index) => {
                const date = new Date(user.lastSolveTime || Date.now());
                const formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

                return (
                  <tr
                    key={user._id || index}
                    style={{ borderBottom: "1px solid rgba(0,255,65,0.1)" }}
                  >
                    <td style={{ padding: "1rem", color: "var(--neon)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text)" }}>
                      {user.name || "UNKNOWN"}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-dim)" }}>
                      {user.admissionNumber || "N/A"}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--neon)" }}>
                      {user.currentLevel || 0}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-dim)" }}>
                      {formattedTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
