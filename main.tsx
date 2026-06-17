import { createRoot } from "react-dom/client";
import App from "./client/App";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
