
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Users, Cog, Package, Truck, Wrench, BarChart3, Calendar } from "lucide-react"
import { Link } from "react-router-dom"

const Home = () => {
  const menuOptions = [
    { title: "Dashboard", path: "/dashboard", icon: BarChart3, description: "Vista general del sistema" },
    { title: "Clientes", path: "/clientes", icon: Users, description: "Gestión de clientes" },
    { title: "Máquinas", path: "/maquinas", icon: Coffee, description: "Control de máquinas expendedoras" },
    { title: "Insumos", path: "/insumos", icon: Package, description: "Inventario de insumos" },
    { title: "Proveedores", path: "/proveedores", icon: Truck, description: "Gestión de proveedores" },
    { title: "Técnicos", path: "/tecnicos", icon: Wrench, description: "Personal técnico" },
    { title: "Mantenimientos", path: "/mantenimientos", icon: Calendar, description: "Registro de mantenimientos" },
    { title: "Reportes", path: "/reportes", icon: BarChart3, description: "Reportes y estadísticas" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <img 
              src="/uploads/3819b112-acd9-4e08-b549-b21cbbce8cc2.png" 
              alt="Cafés Marloy Logo" 
              className="mx-auto w-64 h-64 object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-coffee-800 mb-2">Sistema Administrativo</h1>
          <p className="text-lg text-coffee-600">Gestión integral de máquinas expendedoras</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuOptions.map((option) => (
            <Link key={option.path} to={option.path}>
              <Card className="h-full bg-white border-coffee-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <option.icon className="h-12 w-12 text-coffee-600 mx-auto group-hover:text-coffee-800 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-coffee-800 mb-2">{option.title}</h3>
                  <p className="text-sm text-coffee-600">{option.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Access Button */}
        <div className="text-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-coffee-600 hover:bg-coffee-700 text-white px-8 py-3 text-lg">
              <Coffee className="mr-2 h-5 w-5" />
              Acceder al Sistema
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-coffee-600">
          <p className="text-sm">© 2024 Cafés Marloy - Sabor que Relaja</p>
        </div>
      </div>
    </div>
  )
}

export default Home
