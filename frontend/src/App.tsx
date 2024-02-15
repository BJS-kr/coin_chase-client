import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import "./App.css";
import GameMap from "./components/GameMap";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/game" element={<GameMap />}></Route>
    </Routes>
  );
}

export default App;
