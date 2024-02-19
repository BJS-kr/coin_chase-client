import { useEffect, useState } from "react";
import "../css/GameMap.css";
import { RenderGrid } from "./RenderGrid";
import { GetId, GetRelatedPositions, SendStatus } from "../../wailsjs/go/main/App";
import { protodef } from '../../wailsjs/go/models';

const GameMap = () => {
  const [userId, setUserId] = useState("");
  const gridSize = 20;
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [relatedPositions, setRelatedPositions] = useState<protodef.RelatedPositions>({} as protodef.RelatedPositions);

  GetId().then((id) => {
    setUserId(id);
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          setPosition({
            x: position.x,
            y: Math.max(0, position.y - 1),
          });
          break;
        case "ArrowDown":
          setPosition({
            x: position.x,
            y: Math.min(gridSize - 1, position.y + 1),
          });
          break;
        case "ArrowLeft":
          setPosition({
            x: Math.max(0, position.x - 1),
            y: position.y,
          });
          break;
        case "ArrowRight":
          setPosition({
            x: Math.min(gridSize - 1, position.x + 1),
            y: position.y,
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [position]);
  // Generate the grid

  useEffect(() => {
    if (userId === "") return;
    SendStatus({
      id: userId,
      currentPosition: position,
    });

    }, [relatedPositions]);

  useEffect(() => {
    const getRelatedPositions = async () => {
      const relatedPositions = await GetRelatedPositions();
      setRelatedPositions(relatedPositions);
    };

    const intervalId = setInterval(getRelatedPositions, 100);

    return () => clearInterval(intervalId);
  }, []);

  return <div className="grid">{RenderGrid(gridSize, relatedPositions)}</div>;
};

export default GameMap;
