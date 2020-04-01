import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

import App from "./App";
import { history } from "./history";
import "./index.scss";

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
