
import { 
  Coffee,
  Users,
  Cog,
  Package,
  Truck,
  Wrench,
  BarChart3,
  Settings,
  Home,
  Calendar,
  ArrowLeft
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
  },
  {
    title: "Máquinas",
    url: "/maquinas",
    icon: Coffee,
  },
  {
    title: "Insumos",
    url: "/insumos",
    icon: Package,
  },
  {
    title: "Proveedores",
    url: "/proveedores",
    icon: Truck,
  },
  {
    title: "Técnicos",
    url: "/tecnicos",
    icon: Wrench,
  },
  {
    title: "Mantenimientos",
    url: "/mantenimientos",
    icon: Calendar,
  },
  {
    title: "Reportes",
    url: "/reportes",
    icon: BarChart3,
  },
]

const adminItems = [
  {
    title: "Configuración",
    url: "/configuracion",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-coffee-200">
      <SidebarHeader className="p-6 border-b border-coffee-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-coffee-600 rounded-lg flex items-center justify-center">
            <Coffee className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-coffee-800">Cafés Marloy</h2>
            <p className="text-sm text-coffee-600">Sistema Administrativo</p>
          </div>
        </div>
        
        {/* Back to Home button */}
        <div className="mt-4">
          <Link to="/">
            <SidebarMenuButton className="w-full hover:bg-coffee-100 hover:text-coffee-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al Inicio</span>
            </SidebarMenuButton>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-coffee-700 font-medium">Gestión Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-coffee-100 hover:text-coffee-800">
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-coffee-700 font-medium">Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-coffee-100 hover:text-coffee-800">
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-coffee-200">
        <div className="text-xs text-coffee-600 text-center">
          © 2024 Cafés Marloy
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
