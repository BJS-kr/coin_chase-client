import { useEffect, useState } from "react";
import "../css/GameMap.css";
import { RenderGrid } from "./RenderGrid";
import {
  GetId,
  GetRelatedPositions,
  SendStatus,
  SendAttack,
} from "../../wailsjs/go/main/App";
import { protodef } from "../../wailsjs/go/models";

const ARROW_UP = "ArrowUp";
const ARROW_DOWN = "ArrowDown";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const ATTACK = "a";

const GameMap = () => {
  const [userId, setUserId] = useState("");
  const gridSize = 20;
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    lastDirection: "",
  });  
  const [relatedPositions, setRelatedPositions] = useState<protodef.RelatedPositions>({} as protodef.RelatedPositions);

  const handleAttack = () => {
    if (position.lastDirection === "") {
      return;
    }

    const attackPosition = {
      x: position.x,
      y: position.y,
    };

    if (position.lastDirection === ARROW_UP) {
      attackPosition.y -= 1;
    } else if (position.lastDirection === ARROW_DOWN) {
      attackPosition.y += 1;
    } else if (position.lastDirection === ARROW_LEFT) {
      attackPosition.x -= 1;
    } else if (position.lastDirection === ARROW_RIGHT) {
      attackPosition.x += 1;
    }
    const attack = {
      UserId: userId,
      UserPosition: position,
      AttackPosition: attackPosition,
    }

    console.log(attack, position.lastDirection);

    SendAttack(attack);
  };
  const getRelatedPositions = async () => {
    const relatedPositions = await GetRelatedPositions();

      setRelatedPositions(relatedPositions);
    };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    switch (event.key) {
        case ARROW_UP:

          setPosition({
            x: position.x,
            y: Math.max(0, position.y - 1),
            lastDirection: ARROW_UP,
          });
          break;
        case ARROW_DOWN:
          setPosition({
            x: position.x,
            y: Math.min(gridSize - 1, position.y + 1),
            lastDirection: ARROW_DOWN,
          });
          break;
        case ARROW_LEFT:
          setPosition({
            x: Math.max(0, position.x - 1),
            y: position.y,
            lastDirection: ARROW_LEFT,
          });
          break;
        case ARROW_RIGHT:
          setPosition({
            x: Math.min(gridSize - 1, position.x + 1),
            y: position.y,
            lastDirection: ARROW_RIGHT,
          });
          break;
        case ATTACK:
          handleAttack();
          break;
        default:
          console.log("Unknown key");
      }
    };


  GetId().then((id) => {
    setUserId(id);
  });
  

  useEffect(() => {
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
  }, [position]);

  useEffect(() => {
    const intervalId = setInterval(getRelatedPositions, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid">
      <RenderGrid
        gridSize={gridSize}
        relatedPositions={relatedPositions}
        userId={userId}
      />
    </div>
  );
};

export default GameMap;
