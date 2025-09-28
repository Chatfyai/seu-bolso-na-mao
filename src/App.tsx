import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AccountType from "./pages/AccountType";
import Setup from "./pages/Setup";
import Loading from "./pages/Loading";
import ChartPreference from "./pages/ChartPreference";
import Dashboard from "./pages/Dashboard";
import NovoLancamento from "./pages/NovoLancamento";
import LembretesPagamento from "./pages/LembretesPagamento";
import EmBreve from "./pages/EmBreve";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <Loading />;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/account-type" replace />;
  }
  
  return <>{children}</>;
};

const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <Loading />;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (profile?.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Onboarding Routes */}
          <Route path="/account-type" element={
            <OnboardingRoute>
              <AccountType />
            </OnboardingRoute>
          } />
          <Route path="/setup" element={
            <OnboardingRoute>
              <Setup />
            </OnboardingRoute>
          } />
          <Route path="/chart-preference" element={
            <OnboardingRoute>
              <ChartPreference />
            </OnboardingRoute>
          } />
          
          {/* Authenticated Routes */}
          <Route path="/dashboard" element={
            <AuthenticatedRoute>
              <Dashboard />
            </AuthenticatedRoute>
          } />
          <Route path="/novo-lancamento" element={
            <AuthenticatedRoute>
              <NovoLancamento />
            </AuthenticatedRoute>
          } />
          <Route path="/lembretes-pagamento" element={
            <AuthenticatedRoute>
              <LembretesPagamento />
            </AuthenticatedRoute>
          } />
          <Route path="/em-breve" element={
            <AuthenticatedRoute>
              <EmBreve />
            </AuthenticatedRoute>
          } />
          <Route path="/perfil" element={
            <AuthenticatedRoute>
              <Perfil />
            </AuthenticatedRoute>
          } />
          
          <Route path="/loading" element={<Loading />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
