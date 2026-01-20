import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import PlanilhaGeral from "./pages/PlanilhaGeral";
import CarneLeao from "./pages/CarneLeao";
import ControleHolding from "./pages/ControleHolding";
import EcdEcf from "./pages/EcdEcf";
import LucroReal from "./pages/LucroReal";
import LucroPresumido from "./pages/LucroPresumido";
import TerceiroSetor from "./pages/TerceiroSetor";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";

// Layout
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            
            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/planilha-geral" element={<PlanilhaGeral />} />
              <Route path="/carne-leao" element={<CarneLeao />} />
              <Route path="/controle-holding" element={<ControleHolding />} />
              <Route path="/ecd-ecf" element={<EcdEcf />} />
              <Route path="/lucro-real" element={<LucroReal />} />
              <Route path="/lucro-presumido" element={<LucroPresumido />} />
              <Route path="/terceiro-setor" element={<TerceiroSetor />} />
              <Route path="/usuarios" element={<Usuarios />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
