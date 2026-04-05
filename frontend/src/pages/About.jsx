import { useNavigate } from "react-router-dom";

const events = [
  {
    name: "SHERLOCKED",
    num: "01",
    desc: "An online mystery-solving competition where participants follow a storyline and solve clues to uncover the identity of a thief. Each stage unlocks new hints that test observation and analytical thinking.",
  },
  {
    name: "DOMINION",
    num: "02",
    desc: "An online esports tournament featuring structured scheduling, live broadcasts, and commentary. Teams compete in multiplayer games to claim the top spot in a professional gaming environment.",
  },
  {
    name: "VR EXPO",
    num: "03",
    desc: "Showcases Virtual Reality technology through demonstrations and interactive sessions. Participants experience VR equipment firsthand while learning about its real-world applications.",
  },
  {
    name: "CRAFFITI",
    num: "04",
    desc: "An online drawing and guessing competition. Players sketch words while others guess them correctly, with points awarded for accuracy and creativity across themed rounds.",
  },
  {
    name: "BLIND CODE",
    num: "05",
    desc: "A pair-programming challenge where one participant codes blindfolded and the other provides verbal instructions. Focuses heavily on communication and logical problem-solving.",
  },
  {
    name: "LOOT",
    num: "06",
    desc: "A fast-paced riddle-solving competition where participants progress through multiple puzzle rounds. Each solved clue unlocks the next challenge in a race against time.",
    highlight: true,
  },
  {
    name: "CODEWARS",
    num: "07",
    desc: "A competitive coding contest ranging from logical puzzles to real-world scenarios. Rankings are based on accuracy, execution speed, and solution efficiency.",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div
      className="about-wrapper"
      style={{
        paddingTop: "80px",
        paddingBottom: "3rem",
        px: "1.5rem",
        minHeight: "100vh",
      }}
    >
      <button
        className="auth-back"
        onClick={() => navigate("/")}
        style={{ marginLeft: "10%", marginBottom: "1rem" }}
      >
        ← [ BACK_TO_SURFACE ]
      </button>

      <div
        className="about-header"
        style={{ marginLeft: "10%", marginRight: "10%" }}
      >
        <p className="about-eyebrow">NCS_EVENTS // DIRECTORY_LOADED</p>
        <h1 className="about-title cinzel">ABOUT THE HUNT</h1>
        <p className="about-sub">
          LOOT is one of seven events hosted by NCS. Here is the full roster.
        </p>
      </div>

      <div className="about-grid" style={{ margin: "0 auto", width: "80%" }}>
        {events.map((event) => (
          <div
            key={event.num}
            className={`about-card${event.highlight ? " about-card--highlight" : ""}`}
          >
            <div className="about-card-num">{event.num}</div>
            <h2 className="about-card-name cinzel">{event.name}</h2>
            <p className="about-card-desc">{event.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
