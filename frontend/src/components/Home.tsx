import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo-universal.png";
import {
  LogIn,
  SetServerPort,
  StartUpdateMapStatus,
} from "../../wailsjs/go/main/App";

export const Home = () => {
  const [loginText, setLoginText] = useState("아이디를 입력해주세요 👇");
  const [id, setId] = useState("");
  const updateId = (e: any) => setId(e.target.value);
  const navigate = useNavigate();

  return (
    <div id="App">
      <img src={logo} id="logo" alt="logo" />
      <div id="login" className="login">
        {loginText}
      </div>
      <div id="input" className="input-box">
        <input
          id="name"
          className="input"
          onChange={updateId}
          autoComplete="off"
          name="input"
          type="text"
        />
        <button
          className="btn"
          onClick={async () => {
            await SetServerPort(await LogIn(id));
            await StartUpdateMapStatus();
            navigate("/game");
          }}
        >
          Log-in
        </button>
      </div>
    </div>
  );
};
