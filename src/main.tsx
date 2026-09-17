
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ToastProvider } from "./components/ui/Toast";
import { FcmPushProvider } from "./services/fcm/useFcmPush";
import { ensurePwaSw } from "./services/fcm/fcm.service";
import AppRouter from "./app/router/AppRouter";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void ensurePwaSw();
  });
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <FcmPushProvider />
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  </Provider>
);
