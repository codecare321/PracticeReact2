import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
// import "./css/style.css";
import "./css/satoshi.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router future={{ v7_startTransition: true }}>
      <App />
    </Router>
  </StrictMode>
);
