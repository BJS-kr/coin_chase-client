import { useState } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import { SetId } from "./communicate";

function App() {
  const [loginText, setLoginText] = useState("아이디를 입력해주세요 👇");
  const [_, setId] = useState("");
  const updateId = (e: any) => setId(e.target.value);

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
          onClick={(e) => {
            SetId(e.currentTarget.value);
            setLoginText(`환영합니다 ${e.currentTarget.value} 님!`);
          }}
        >
          Log-in
        </button>
      </div>
    </div>
  );
}

export default App;
