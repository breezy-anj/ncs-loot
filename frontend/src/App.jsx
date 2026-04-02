import { useState, useEffect } from 'react';
import './App.css';

import SplashScreen from './components/SplashScreen';
import Navbar       from './components/Navbar';
import Home         from './pages/Home';
import Auth         from './pages/Auth';
import Dashboard    from './pages/Dashboard';

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [view, setView]             = useState('home');   // 'home' | 'login' | 'register' | 'dashboard'
  const [user, setUser]             = useState(null);
  const [token, setToken]           = useState(null);

  // ── Restore session on mount ─────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('loot_token');
    const savedUser  = localStorage.getItem('loot_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setView('dashboard');
      } catch {
        // Corrupt data — wipe it
        localStorage.removeItem('loot_token');
        localStorage.removeItem('loot_user');
      }
    }
  }, []);

  // ── Auth success (login only) ────────────────
  // Auth.jsx calls this with { token, user } after a successful login
  const handleAuthSuccess = ({ token: newToken, user: newUser }) => {
    localStorage.setItem('loot_token', newToken);
    localStorage.setItem('loot_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setView('dashboard');
  };

  // ── Logout ───────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('loot_token');
    localStorage.removeItem('loot_user');
    setToken(null);
    setUser(null);
    setView('home');
  };

  // ── Navigation guard ─────────────────────────
  const handleNavigate = (target) => {
    // Prevent navigating to dashboard without being logged in
    if (target === 'dashboard' && !token) {
      setView('login');
      return;
    }
    setView(target);
  };

  // ── Splash ───────────────────────────────────
  if (!splashDone) {
    return <SplashScreen onFinished={() => setSplashDone(true)} />;
  }

  return (
    <div className="app-shell">
      {/* Ambient layers */}
      <div className="bg-grid"     aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />
      <div className="bg-scanline" aria-hidden="true" />

      <Navbar
        isLoggedIn={!!token}
        userName={user?.zealId}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="app-content">
        {view === 'home' && (
          <Home onNavigate={handleNavigate} />
        )}

        {view === 'login' && (
          <Auth
            mode="login"
            onAuthSuccess={handleAuthSuccess}
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        )}

        {view === 'register' && (
          <Auth
            mode="register"
            onAuthSuccess={handleAuthSuccess}
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        )}

        {view === 'dashboard' && token && (
          <Dashboard
            user={user}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

export default App;
