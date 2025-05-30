
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Download, 
  TrendingUp, 
  Users, 
  Coffee, 
  Package,
  Calendar
} from "lucide-react"

const facturacionData = [
  { mes: 'Ene', alquiler: 180000, insumos: 75000, total: 255000 },
  { mes: 'Feb', alquiler: 185000, insumos: 82000, total: 267000 },
  { mes: 'Mar', alquiler: 190000, insumos: 88000, total: 278000 },
  { mes: 'Abr', alquiler: 195000, insumos: 91000, total: 286000 },
  { mes: 'May', alquiler: 200000, insumos: 95000, total: 295000 },
  { mes: 'Jun', alquiler: 205000, insumos: 98000, total: 303000 }
]

const consumoInsumosData = [
  { nombre: 'Café Premium', consumo: 45, costo: 38250 },
  { nombre: 'Leche en Polvo', consumo: 35, costo: 15750 },
  { nombre: 'Azúcar', consumo: 60, costo: 7200 },
  { nombre: 'Chocolate', consumo: 20, costo: 13600 },
  { nombre: 'Canela', consumo: 8, costo: 9600 }
]

const tecnicosData = [
  { nombre: 'Ana B. Torres', mantenimientos: 52 },
  { nombre: 'Juan C. Mendez', mantenimientos: 45 },
  { nombre: 'María E. Vásquez', mantenimientos: 38 },
  { nombre: 'Diego Ramírez', mantenimientos: 31 },
  { nombre: 'Roberto Silva', mantenimientos: 29 }
]

const clientesMaquinasData = [
  { name: 'Universidad Norte', value: 8, color: '#8B4513' },
  { name: 'Hospital Regional', value: 5, color: '#A0522D' },
  { name: 'Oficinas Central', value: 3, color: '#CD853F' },
  { name: 'Hotel Plaza', value: 2, color: '#DAA520' },
  { name: 'Otros', value: 12, color: '#D2B48C' }
]

export default function Reportes() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Reportes y Análisis</h1>
          <p className="text-coffee-600 mt-1">Consultas y estadísticas del negocio</p>
        </div>
        <Button className="bg-coffee-600 hover:bg-coffee-700 text-white">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reportes
        </Button>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-coffee-500 to-coffee-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coffee-100 text-sm">Facturación Mensual</p>
                <p className="text-2xl font-bold">$425,680</p>
              </div>
              <TrendingUp className="h-8 w-8 text-coffee-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-coffee-400 to-coffee-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coffee-100 text-sm">Clientes Activos</p>
                <p className="text-2xl font-bold">48</p>
              </div>
              <Users className="h-8 w-8 text-coffee-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-coffee-600 to-coffee-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coffee-100 text-sm">Máquinas Operativas</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Coffee className="h-8 w-8 text-coffee-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-coffee-300 to-coffee-400 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coffee-100 text-sm">Tipos de Insumos</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Package className="h-8 w-8 text-coffee-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de facturación */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Facturación Mensual por Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facturacionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C1" />
                <XAxis dataKey="mes" stroke="#8B4513" />
                <YAxis stroke="#8B4513" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F5F5DC', 
                    border: '1px solid #8B4513',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="alquiler" stackId="a" fill="#8B4513" name="Alquiler de Máquinas" />
                <Bar dataKey="insumos" stackId="a" fill="#DAA520" name="Costo de Insumos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top insumos */}
        <Card className="bg-white border-coffee-200">
          <CardHeader>
            <CardTitle className="text-coffee-800">Insumos con Mayor Consumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consumoInsumosData.map((insumo, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-coffee-50 rounded-lg">
                  <div>
                    <div className="font-medium text-coffee-800">{insumo.nombre}</div>
                    <div className="text-sm text-coffee-600">{insumo.consumo} kg/mes</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-coffee-800">${insumo.costo.toLocaleString()}</div>
                    <div className="text-sm text-coffee-600">costo mensual</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top técnicos */}
        <Card className="bg-white border-coffee-200">
          <CardHeader>
            <CardTitle className="text-coffee-800">Técnicos más Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tecnicosData.map((tecnico, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-coffee-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-yellow-600' : 'bg-coffee-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="font-medium text-coffee-800">{tecnico.nombre}</div>
                  </div>
                  <div className="text-coffee-600">
                    <span className="font-medium">{tecnico.mantenimientos}</span> servicios
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de máquinas por cliente */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Distribución de Máquinas por Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientesMaquinasData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {clientesMaquinasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
