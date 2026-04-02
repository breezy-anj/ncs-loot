import { useState, useEffect } from 'react';
import AnswerPopup from '../components/AnswerPopup';
import { API_BASE } from '../config';

/**
 * Dashboard
 * Props:
 *   user     – { id, name, zealId, hasSubmitted }
 *   onLogout – called when the session should be cleared
 */
const Dashboard = ({ user, onLogout }) => {
  const [clues, setClues]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(user?.hasSubmitted ?? false);

  // ── Fetch clues on mount ─────────────────────
  useEffect(() => {
    const fetchClues = async () => {
      try {
        const token = localStorage.getItem('loot_token');
        const res   = await fetch(`${API_BASE}/api/game/clues`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          // Token expired — force logout
          onLogout();
          return;
        }

        const data = await res.json();

        if (data.success) {
          setClues(data.clues || []);
        } else {
          setFetchError('FAILED_TO_LOAD_INTEL — CONTACT_HQ');
        }
      } catch {
        setFetchError('TERMINAL_OFFLINE — RETRYING...');
      } finally {
        setLoading(false);
      }
    };

    fetchClues();
  }, [onLogout]);

  const handleSubmitSuccess = () => {
    setHasSubmitted(true);
    // Persist updated state to localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('loot_user') || '{}');
      localStorage.setItem('loot_user', JSON.stringify({ ...saved, hasSubmitted: true }));
    } catch {
      // non-critical
    }
  };

  // ── Loading ──────────────────────────────────
  if (loading) {
    return (
      <div className="loading-screen" style={{ paddingTop: '56px' }}>
        <p className="loading-text">SYNCHRONIZING_OPERATIVE_DATA...</p>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────
  return (
    <>
      {showPopup && (
        <AnswerPopup
          onClose={() => setShowPopup(false)}
          onSuccess={handleSubmitSuccess}
        />
      )}

      <div className="dashboard-wrapper">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-status">
            <span className="status-dot" /> OPERATIVE_ONLINE
          </div>

          <p className="sidebar-name cinzel">{user?.zealId || 'UNKNOWN'}</p>

          <div className="sidebar-divider" />

          <div className="sidebar-info">
            NAME<span>{user?.name || 'REDACTED'}</span>
            ACCESS_LEVEL<span>OPERATIVE — 01</span>
            CLUES_LOADED<span>{clues.length}</span>
          </div>

          {hasSubmitted && (
            <div className="submitted-badge">
              ✓ FINAL_ANSWER_SUBMITTED
            </div>
          )}
        </aside>

        {/* ── Intel Panel ── */}
        <section className="intel-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title cinzel">ACTIVE_MISSIONS</h2>
              <p className="panel-sub">Solve each clue — combine answers to unlock the vault.</p>
            </div>

            <button
              className="final-submit-btn"
              onClick={() => setShowPopup(true)}
              disabled={hasSubmitted}
              title={hasSubmitted ? 'Already submitted' : 'Submit your final answer'}
            >
              {hasSubmitted ? '✓ SUBMITTED' : '[ SUBMIT_FINAL_ANSWER ]'}
            </button>
          </div>

          {fetchError && (
            <p className="popup-error" style={{ marginBottom: '1.5rem' }}>
              ⚠ {fetchError}
            </p>
          )}

          <div className="clues-list">
            {clues.length > 0 ? (
              clues.map((clue, idx) => (
                <div key={clue.id ?? idx} className="clue-card">
                  <span className="clue-number">
                    CLUE — #{String(idx + 1).padStart(2, '0')}
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
