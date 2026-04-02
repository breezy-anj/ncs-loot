import { useState } from 'react';
import { API_BASE } from '../config';

/**
 * Auth
 * Props:
 *   mode          – 'login' | 'register'
 *   onAuthSuccess – called with { token, user } after a successful login
 *   onBack        – navigates back to home
 *   onNavigate    – used to switch between login/register views
 */
const Auth = ({ mode, onAuthSuccess, onBack, onNavigate }) => {
  const isLogin = mode === 'login';

  const [formData, setFormData] = useState({
    name: '',
    zealId: '',
    year: '',
    admissionNumber: '',
    password: '',
  });

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleChange = (e) => {
    setError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload  = isLogin
      ? { zealId: formData.zealId, password: formData.password }
      : formData;

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        if (isLogin) {
          // Hand full auth payload (token + user) back to App
          onAuthSuccess({ token: data.token, user: data.user });
        } else {
          setSuccess('IDENTITY_CREATED — PROCEED TO LOGIN');
          setTimeout(() => onNavigate('login'), 1800);
        }
      } else {
        setError(data.message || 'ACCESS_DENIED');
      }
    } catch {
      setError('TERMINAL_OFFLINE — CHECK_CONNECTION');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <button className="auth-back" onClick={onBack}>
          ← [ BACK_TO_SURFACE ]
        </button>

        <h2 className="auth-title cinzel">
          {isLogin ? 'IDENTITY_VERIFICATION' : 'CREATE_OPERATIVE'}
        </h2>
        <p className="auth-mode-line">
          {isLogin
            ? 'Enter your credentials to access the vault.'
            : 'Register to participate in the hunt.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* ── Zeal ID (always shown) ── */}
          <div className="form-row">
            <div className="field full">
              <label>ZEAL_ID</label>
              <input
                name="zealId"
                type="text"
                placeholder="Your Zeal ID..."
                value={formData.zealId}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* ── Register-only fields ── */}
          {!isLogin && (
            <>
              <div className="form-row">
                <div className="field full">
                  <label>OPERATIVE_NAME</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name..."
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>YEAR</label>
                  <input
                    name="year"
                    type="text"
                    placeholder="1, 2, 3..."
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label>ADMISSION_NO</label>
                  <input
                    name="admissionNumber"
                    type="text"
                    placeholder="Admission No..."
                    value={formData.admissionNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* ── Password ── */}
          <div className="form-row">
            <div className="field full">
              <label>ACCESS_KEY</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          {/* ── Feedback ── */}
          {error   && <p className="auth-error">⚠ {error}</p>}
          {success && <p className="auth-success">✓ {success}</p>}

          <button type="submit" className="submit-btn cinzel" disabled={loading}>
            {loading
              ? 'PROCESSING...'
              : isLogin
              ? 'UNLOCK_VAULT'
              : 'CREATE_ALIAS'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? (
            <>First time at these ruins?&nbsp;
              <span onClick={() => onNavigate('register')}>[ CREATE_ALIAS ]</span>
            </>
          ) : (
            <>Already an operative?&nbsp;
              <span onClick={() => onNavigate('login')}>[ LOGIN ]</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
