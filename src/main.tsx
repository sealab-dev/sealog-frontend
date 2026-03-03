import { Buffer } from "buffer";
// @ts-expect-error Buffer polyfill for @react-pdf/renderer
globalThis.Buffer = Buffer;
import ReactDOM from "react-dom/client";
import "@/styles/global.css";
import { AppRouter } from "./router/AppRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/core/queryClient";
import { GlobalLoading } from "@/components/ui/loading/GlobalLoading";
import { Toast } from "@/components/ui/toast/Toast";
import { LoginModal } from "./features/auth/components/LoginModal";
import { ThemeProvider } from "./components/ui/theme/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AppRouter />
      <LoginModal />
      <Toast />
      <GlobalLoading />
    </ThemeProvider>
  </QueryClientProvider>,
);
