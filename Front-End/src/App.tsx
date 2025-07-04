
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Clientes from "./pages/Clientes";
import Maquinas from "./pages/Maquinas";
import Insumos from "./pages/Insumos";
import Proveedores from "./pages/Proveedores";
import Tecnicos from "./pages/Tecnicos";
import Mantenimientos from "./pages/Mantenimientos";
import NotFound from "./pages/NotFound";
import Consumos from "./pages/Consumos";

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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes - redirect to clientes as main page */}
            <Route path="/dashboard" element={<Navigate to="/clientes" replace />} />
            <Route path="/clientes" element={
              <ProtectedRoute>
                <AdminLayout><Clientes /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/maquinas" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><Maquinas /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/insumos" element={
              <ProtectedRoute>
                <AdminLayout><Insumos /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/proveedores" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><Proveedores /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/tecnicos" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><Tecnicos /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/consumos" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><Consumos /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/mantenimientos" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><Mantenimientos /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
