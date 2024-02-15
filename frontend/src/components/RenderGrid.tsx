export const RenderGrid = (
  gridSize: number,
  position: { x: number; y: number }
) => {
  const rows = [];
  for (let y = 0; y < gridSize; y++) {
    const cells = [];
    for (let x = 0; x < gridSize; x++) {
      const isHere = position.x === x && position.y === y;
      cells.push(
        <div key={`${x}-${y}`} className={isHere ? "here" : "cell"}></div>
      );
    }
    rows.push(
      <div key={`${y}`} className="row">
        {cells}
      </div>
    );
  }

  return rows;
};
