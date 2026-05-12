import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Detect iOS and add class to html element for platform-specific styling
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
if (isIOS) {
  document.documentElement.classList.add('is-ios');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
