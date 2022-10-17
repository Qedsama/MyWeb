import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios"

axios.defaults.baseURL=process.env.NODE_ENV === "production"?"111":"http://localhost:5000";
axios.defaults.headers.post["Content-Type"] = "application/json"
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <App />
  </Router>
);
