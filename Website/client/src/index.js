import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./reduxStore";
import "./index.css";
import App from "./App";
import { sendToVercelAnalytics } from "./vitals";
import reportWebVitals from "./reportWebVitals";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
reportWebVitals(sendToVercelAnalytics);
