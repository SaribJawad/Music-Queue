import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { GlobalProvider } from "./contexts/authContext.tsx";
import { StreamContextProvider } from "./contexts/streamContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <StreamContextProvider>
          <App />
        </StreamContextProvider>
      </GlobalProvider>
    </BrowserRouter>
  </StrictMode>
);
