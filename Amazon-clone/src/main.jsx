import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataProvider } from "./assets/Components/DataProvider/DataProvider.jsx";
import { reducer, initialState } from "./Utility/reducer.js";

createRoot(document.getElementById("root")).render(
  <DataProvider value={reducer} initialState={initialState}>
    <StrictMode>
      <App />
    </StrictMode>
  </DataProvider>
);
