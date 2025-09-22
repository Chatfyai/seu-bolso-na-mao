import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AccountType from "./pages/AccountType";
import Setup from "./pages/Setup";
import Loading from "./pages/Loading";
import ChartPreference from "./pages/ChartPreference";
import Dashboard from "./pages/Dashboard";
import NovoLancamento from "./pages/NovoLancamento";
import LembretesPagamento from "./pages/LembretesPagamento";
import EmBreve from "./pages/EmBreve";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account-type" element={<AccountType />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/chart-preference" element={<ChartPreference />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/novo-lancamento" element={<NovoLancamento />} />
          <Route path="/lembretes-pagamento" element={<LembretesPagamento />} />
          <Route path="/em-breve" element={<EmBreve />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
