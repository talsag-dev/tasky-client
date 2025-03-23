import { Theme } from "@radix-ui/themes";
import "./App.css";
import "./lib/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { AppShell } from "./pages/AppShell/AppShell";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <Theme>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </Theme>
  );
};
