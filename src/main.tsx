import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import HandleApp from "./app";
import "./app.css";
import { createAppStore } from "./store/store";

const ROOT_ELEMENT_ID = "root";
const ROOT_ELEMENT_MISSING_MESSAGE = "Root element not found";
const APP_STORE = createAppStore();
const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (!rootElement) {
  console.error(ROOT_ELEMENT_MISSING_MESSAGE);
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={APP_STORE}>
        <BrowserRouter>
          <HandleApp />
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
}
