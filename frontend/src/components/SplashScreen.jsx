import { useEffect } from 'react';

const SplashScreen = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(onFinished, 4000);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="splash">
      <div className="bg-grid" />

      <h1 className="splash-title cinzel">LOOT</h1>
      <p className="splash-sub">THE GRAND HUNT</p>

      <div className="splash-bar-track">
        <div className="splash-bar-fill" />
      </div>

      <p className="splash-status blink">INITIALIZING OPERATIVE SYSTEM...</p>
    </div>
  );
};

export default SplashScreen;
