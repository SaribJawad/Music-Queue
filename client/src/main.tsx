import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { LoadingActionProvider } from "./contexts/loadingActionProvider.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LoadingActionProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LoadingActionProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
