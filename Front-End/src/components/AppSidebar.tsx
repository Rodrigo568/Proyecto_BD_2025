
import { 
  Coffee,
  Users,
  Package,
  Truck,
  Wrench,
  Calendar,
  LogOut,
  User
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
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

const menuItems = [
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
]

export function AppSidebar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
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
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-coffee-200 space-y-3">
        {/* User Info */}
        <div className="flex items-center space-x-3 p-2 bg-coffee-50 rounded-md">
          <div className="bg-coffee-600 p-2 rounded-full">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-coffee-800 truncate">
              {user?.nombre}
            </p>
            <p className="text-xs text-coffee-600 truncate">
              {user?.cargo}
              {isAdmin && " (Admin)"}
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full border-coffee-300 text-coffee-700 hover:bg-coffee-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
        
        <div className="text-xs text-coffee-600 text-center">
          © 2025 Cafés Marloy
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
