import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "@fontsource/cormorant/cyrillic-500.css";
import "@fontsource/cormorant/cyrillic-600.css";
import "@fontsource/cormorant/cyrillic-700.css";
import "@fontsource/cormorant/latin-500.css";
import "@fontsource/cormorant/latin-600.css";
import "@fontsource/cormorant/latin-700.css";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
