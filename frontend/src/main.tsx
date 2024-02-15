import React from "react";
import ReactDom from "react-dom";
import "./style.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDom.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
