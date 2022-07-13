import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./css/reset.css";
import "./css/style.css";
import "./css/fonts.css";

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);