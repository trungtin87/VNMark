import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ManChanLoi from "./ManChanLoi.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ManChanLoi>
      <App />
    </ManChanLoi>
  </React.StrictMode>
);
