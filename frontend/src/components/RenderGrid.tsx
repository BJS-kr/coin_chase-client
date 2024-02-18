import { protodef } from '../../wailsjs/go/models';

export const RenderGrid = (
  gridSize: number,
  relatedPositions: protodef.RelatedPositions 
) => {

  const rows = [];
  for (let y = 0; y < gridSize; y++) {
    const cells = [];
    for (let x = 0; x < gridSize; x++) {
      const isHere = relatedPositions?.user_position?.x === x && relatedPositions?.user_position?.y  === y;
      for (const relatedPosition of relatedPositions?.related_positions || []) {
        if (relatedPosition.position?.x === x && relatedPosition.position.y === y){
          if (relatedPosition.cell.occupied) {
            cells.push(
              <div key={`${x}-${y}`} className="occupied"></div>
            );
          } else {
            cells.push(
              <div key={`${x}-${y}`} className="empty"></div>
            );
          }
        } else {
          cells.push(
            <div key={`${x}-${y}`} className={isHere ? "user" : "fog"}></div>
          );
        }
      } 
    }

    rows.push(
      <div key={`${y}`} className="row">
        {cells}
      </div>
    );
  }

  return rows;
};
