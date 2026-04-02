const Navbar = ({ isLoggedIn, userName, onNavigate, onLogout }) => {
  return (
    <nav className="navbar">
      <span className="nav-brand cinzel" onClick={() => onNavigate('home')}>
        LOOT
      </span>

      <div className="nav-status">
        <span className="pulse-dot" />
        SYSTEM_ONLINE
      </div>

      <div className="nav-actions">
        {isLoggedIn ? (
          <>
            <span className="nav-btn" style={{ cursor: 'default', color: 'var(--text-dim)' }}>
              {userName || 'OPERATIVE'}
            </span>
            <button className="nav-btn danger" onClick={onLogout}>
              [ LOGOUT ]
            </button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => onNavigate('login')}>
              [ LOGIN ]
            </button>
            <button className="nav-btn" onClick={() => onNavigate('register')}>
              [ REGISTER ]
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
