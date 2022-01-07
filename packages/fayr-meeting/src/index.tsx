// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from "react";
import ReactDOM from "react-dom";

import App from "./app";
import "./style.css";

window.addEventListener("load", () => {
    ReactDOM.render(<App />, document.getElementById("root"));
});
