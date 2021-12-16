import "./assets/styles.css";
import App from "./components/App";
import React from "react";
import ReactDOM from "react-dom";
import GlobalStyles from "styles/GlobalStyles";

ReactDOM.render(
    <React.StrictMode>
        <GlobalStyles />
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
);
