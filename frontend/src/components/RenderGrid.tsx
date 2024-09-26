import { protodef } from "../../wailsjs/go/models";
import { ScoreboardOverlay } from "./Scoreboard";

export const RenderGrid = ({
  gridSize,
  relatedPositions,
  userId,
}: {
  gridSize: number;
  relatedPositions: protodef.RelatedPositions;
  userId: string;
}) => {
  const rows = [];
  const scoreboard = relatedPositions?.scoreboard ?? {};

  for (let y = 0; y < gridSize; y++) {
    const cells = [];
    for (let x = 0; x < gridSize; x++) {
      let added = false;
      const isHere =
        (relatedPositions?.user_position?.x ?? 0) === x &&
        (relatedPositions?.user_position?.y ?? 0) === y;

      for (const relatedPosition of relatedPositions?.related_positions || []) {
     
        if (
          (relatedPosition.position?.x ?? 0) === x &&
          (relatedPosition.position?.y ?? 0) === y
        ) {
          added = true;
          
          if (relatedPosition.cell.occupied) {
            const kind =
              relatedPosition.cell.kind === 10_001
                ? "otherUser"
                : relatedPosition.cell.kind === 10_002
                ? "coin"
                : relatedPosition.cell.kind === 10_003 ||
                  relatedPosition.cell.kind === 10_004
                ? "item"
                : "unknown";

            if (kind === "unknown")
              console.log(relatedPosition.cell.kind);
              // throw new Error(`kind unknown: ${relatedPosition.cell}`);
            cells.push(<div key={`${x}-${y}`} className={kind}></div>);
          } else {
            cells.push(<div key={`${x}-${y}`} className="ground"></div>);
          }
        }
      }

      if (!added) {
        cells.push(
          <div key={`${x}-${y}`} className={isHere ? "self" : "fog"}></div>
        );
      }
    }

    rows.push(
      <div key={`${y}`} className="row">
        {cells}
      </div>
    );
  }

  return (
    <>
      {rows}
      <ScoreboardOverlay scoreboard={scoreboard} />
    </>
  );
};

export default RenderGrid;
