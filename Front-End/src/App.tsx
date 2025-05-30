
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Maquinas from "./pages/Maquinas";
import Insumos from "./pages/Insumos";
import Proveedores from "./pages/Proveedores";
import Tecnicos from "./pages/Tecnicos";
import Mantenimientos from "./pages/Mantenimientos";
import Reportes from "./pages/Reportes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout component for pages with sidebar
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-coffee-50">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-coffee-200 p-4">
          <SidebarTrigger className="text-coffee-600 hover:text-coffee-800" />
        </header>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/clientes" element={<AdminLayout><Clientes /></AdminLayout>} />
          <Route path="/maquinas" element={<AdminLayout><Maquinas /></AdminLayout>} />
          <Route path="/insumos" element={<AdminLayout><Insumos /></AdminLayout>} />
          <Route path="/proveedores" element={<AdminLayout><Proveedores /></AdminLayout>} />
          <Route path="/tecnicos" element={<AdminLayout><Tecnicos /></AdminLayout>} />
          <Route path="/mantenimientos" element={<AdminLayout><Mantenimientos /></AdminLayout>} />
          <Route path="/reportes" element={<AdminLayout><Reportes /></AdminLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
