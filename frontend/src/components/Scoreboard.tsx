export const ScoreboardOverlay = ({
  scoreboard,
}: {
  scoreboard: { [K in string]: number };
}) => {
  return (
    <div className="scoreboard-overlay">
      <h2>점수표</h2>
      <ul>
        {Object.entries(scoreboard).map(([player, score]) => (
          <li key={player}>
            {player}: {score}
          </li>
        ))}
      </ul>
    </div>
  );
};
