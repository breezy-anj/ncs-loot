import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

import About from "./pages/About";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";

// Protected Route Wrapper - Kicks unauthenticated users to login
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" />;
};

// Public Route Wrapper - Kicks logged-in users straight to the dashboard
const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  return !token ? children : <Navigate to="/dashboard" />;
};

const AppContent = () => {
  const [splashDone, setSplashDone] = useState(false);
  const { token, user, logout } = useAuth();

  // ── Splash Screen ────────────────────────────
  if (!splashDone) {
    return <SplashScreen onFinished={() => setSplashDone(true)} />;
  }

  // ── Main Layout ──────────────────────────────
  return (
    <div className="app-shell">
      {/* Ambient background layers */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />
      <div className="bg-scanline" aria-hidden="true" />

      <Navbar isLoggedIn={!!token} userName={user?.zealId} onLogout={logout} />

      <main className="app-content">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Auth mode="login" />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Auth mode="register" />
              </PublicRoute>
            }
          />
          {/* Protected Area */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Unrestricted Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/leaderboard" element={<Leaderboard />} />s{" "}
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    // The AuthProvider must wrap the Router so navigation guards can access the state
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
