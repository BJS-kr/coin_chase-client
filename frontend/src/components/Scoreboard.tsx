export const ScoreboardOverlay = ({
  scoreboard,
}: {
  scoreboard: { [K in string]: number };
}) => {
  return (
    // align strings left most except h2
    <div className="scoreboard-overlay" 
    style={{textAlign: "left"}}>
      <h2>점수표</h2>
        {Object.entries(scoreboard)
          .sort((a, b) => b[1] - a[1])
          .map(([player, score], index) => (
          <>
              {index + 1}등 {player} {score}점
              <br />
          </>
        ))}
    </div>
  );
};
