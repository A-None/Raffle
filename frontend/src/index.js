import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { customTheme } from "./theme/theme";
import { ThemeProvider } from "styled-components";
import { theme } from "rimble-ui";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={Object.assign({}, theme, customTheme)}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
