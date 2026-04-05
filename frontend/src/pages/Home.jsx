import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home-artifact">
        <div className="artifact-rings" />
        <div className="artifact-box">
          <h1 className="artifact-title cinzel">LOOT</h1>
        </div>
      </div>

      <div className="home-hero">
        <h2 className="home-subtitle cinzel">The Grand Hunt Awaits</h2>
        <p className="home-desc">
          Only the worthy shall enter the vault. Solve the clues, crack the
          cipher, claim the loot.
        </p>

        <button className="begin-btn" onClick={() => navigate("/login")}>
          BEGIN YOUR HUNT
        </button>
      </div>

      <p className="home-coords">SCANNING AREA: [ 28.6139° N | 77.2090° E ]</p>
    </div>
  );
};

export default Home;
