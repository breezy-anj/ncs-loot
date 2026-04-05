import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, userName, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <span className="nav-brand cinzel" onClick={() => navigate("/")}>
        LOOT
      </span>

      <div className="nav-status">
        <span className="pulse-dot" />
        SYSTEM_ONLINE
      </div>

      <div className="nav-actions">
        {/* LEADERBOARD BUTTON */}
        <button className="nav-btn" onClick={() => navigate("/leaderboard")}>
          [ STANDINGS ]
        </button>

        {isLoggedIn ? (
          <>
            <span
              className="nav-btn"
              style={{ cursor: "default", color: "var(--text-dim)" }}
            >
              {userName || "OPERATIVE"}
            </span>
            <button className="nav-btn danger" onClick={onLogout}>
              [ LOGOUT ]
            </button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => navigate("/login")}>
              [ LOGIN ]
            </button>
            <button className="nav-btn" onClick={() => navigate("/register")}>
              [ REGISTER ]
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
