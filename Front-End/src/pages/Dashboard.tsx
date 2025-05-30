
import { DashboardCard } from "@/components/DashboardCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Coffee, 
  Package, 
  DollarSign, 
  TrendingUp,
  Calendar,
  AlertTriangle
} from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Dashboard</h1>
          <p className="text-coffee-600 mt-1">Resumen general del sistema</p>
        </div>
        <Button className="bg-coffee-600 hover:bg-coffee-700 text-white">
          <Calendar className="h-4 w-4 mr-2" />
          Generar Reporte
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Clientes"
          value="48"
          icon={Users}
          description="Clientes activos"
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Máquinas Activas"
          value="156"
          icon={Coffee}
          description="En funcionamiento"
          trend={{ value: 3, isPositive: true }}
        />
        <DashboardCard
          title="Insumos en Stock"
          value="23"
          icon={Package}
          description="Tipos diferentes"
          trend={{ value: 2, isPositive: false }}
        />
        <DashboardCard
          title="Facturación Mensual"
          value="$425,680"
          icon={DollarSign}
          description="Ingresos del mes"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Sección de estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-coffee-200">
          <CardHeader>
            <CardTitle className="text-coffee-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Consumos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-coffee-50 rounded-lg">
                <div>
                  <p className="font-medium text-coffee-800">Cliente: Oficinas Central</p>
                  <p className="text-sm text-coffee-600">Máquina #001 - Café Premium</p>
                </div>
                <span className="text-sm font-medium text-coffee-700">$1,240</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-coffee-50 rounded-lg">
                <div>
                  <p className="font-medium text-coffee-800">Cliente: Hospital Regional</p>
                  <p className="text-sm text-coffee-600">Máquina #015 - Leche en Polvo</p>
                </div>
                <span className="text-sm font-medium text-coffee-700">$850</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-coffee-50 rounded-lg">
                <div>
                  <p className="font-medium text-coffee-800">Cliente: Universidad Norte</p>
                  <p className="text-sm text-coffee-600">Máquina #033 - Chocolate</p>
                </div>
                <span className="text-sm font-medium text-coffee-700">$650</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-coffee-200">
          <CardHeader>
            <CardTitle className="text-coffee-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas y Mantenimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-red-800">Mantenimiento Urgente</p>
                  <p className="text-sm text-red-600">Máquina #025 - Cliente: Hotel Plaza</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-yellow-800">Stock Bajo</p>
                  <p className="text-sm text-yellow-600">Café Premium - Quedan 15 kg</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-blue-800">Mantenimiento Programado</p>
                  <p className="text-sm text-blue-600">Máquina #012 - Mañana 10:00 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
