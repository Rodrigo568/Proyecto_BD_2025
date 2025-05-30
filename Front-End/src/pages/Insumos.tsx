
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Edit, Package, DollarSign, TrendingDown, TrendingUp } from "lucide-react"

const mockInsumos = [
  {
    id: 1,
    nombre: "Café Premium",
    tipo: "Bebida Base",
    proveedor: "Café del Valle S.A.",
    precioUnitario: 850,
    unidadMedida: "kg",
    stockActual: 15,
    stockMinimo: 20,
    consumoMensual: 45
  },
  {
    id: 2,
    nombre: "Leche en Polvo",
    tipo: "Lácteo",
    proveedor: "Lácteos Buenos Aires",
    precioUnitario: 450,
    unidadMedida: "kg",
    stockActual: 25,
    stockMinimo: 15,
    consumoMensual: 35
  },
  {
    id: 3,
    nombre: "Azúcar Refinada",
    tipo: "Endulzante",
    proveedor: "Azucarera Central",
    precioUnitario: 120,
    unidadMedida: "kg",
    stockActual: 50,
    stockMinimo: 25,
    consumoMensual: 60
  },
  {
    id: 4,
    nombre: "Chocolate en Polvo",
    tipo: "Saborizante",
    proveedor: "Chocolates del Sur",
    precioUnitario: 680,
    unidadMedida: "kg",
    stockActual: 8,
    stockMinimo: 12,
    consumoMensual: 20
  },
  {
    id: 5,
    nombre: "Canela Molida",
    tipo: "Especia",
    proveedor: "Especias Aromáticas",
    precioUnitario: 1200,
    unidadMedida: "kg",
    stockActual: 18,
    stockMinimo: 10,
    consumoMensual: 8
  }
]

export default function Insumos() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInsumos = mockInsumos.filter(insumo =>
    insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insumo.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insumo.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockStatus = (stockActual: number, stockMinimo: number) => {
    if (stockActual < stockMinimo) {
      return { status: "Bajo", color: "bg-red-100 text-red-800 border-red-300", icon: TrendingDown }
    } else if (stockActual < stockMinimo * 1.5) {
      return { status: "Medio", color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: TrendingUp }
    } else {
      return { status: "Bueno", color: "bg-green-100 text-green-800 border-green-300", icon: TrendingUp }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Insumos</h1>
          <p className="text-coffee-600 mt-1">Controla el inventario y precios de insumos</p>
        </div>
        <Button className="bg-coffee-600 hover:bg-coffee-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Insumo
        </Button>
      </div>

      {/* Buscador */}
      <Card className="bg-white border-coffee-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
            <Input
              placeholder="Buscar insumos por nombre, tipo o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-coffee-200 focus:border-coffee-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de insumos */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Lista de Insumos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-coffee-700">Insumo</TableHead>
                <TableHead className="text-coffee-700">Proveedor</TableHead>
                <TableHead className="text-coffee-700">Precio</TableHead>
                <TableHead className="text-coffee-700">Stock</TableHead>
                <TableHead className="text-coffee-700">Consumo Mensual</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInsumos.map((insumo) => {
                const stockStatus = getStockStatus(insumo.stockActual, insumo.stockMinimo)
                const IconComponent = stockStatus.icon
                
                return (
                  <TableRow key={insumo.id} className="hover:bg-coffee-50">
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-coffee-600" />
                          <span className="font-medium text-coffee-800">{insumo.nombre}</span>
                        </div>
                        <div className="text-sm text-coffee-600 mt-1">{insumo.tipo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-coffee-700">{insumo.proveedor}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-coffee-700">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-medium">{insumo.precioUnitario}</span>
                      </div>
                      <div className="text-sm text-coffee-600">por {insumo.unidadMedida}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-coffee-800">
                          {insumo.stockActual} {insumo.unidadMedida}
                        </div>
                        <Badge 
                          variant="outline"
                          className={`${stockStatus.color} flex items-center gap-1 w-fit`}
                        >
                          <IconComponent className="h-3 w-3" />
                          {stockStatus.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-coffee-700">
                        <span className="font-medium">{insumo.consumoMensual}</span>
                        <span className="text-sm text-coffee-600 ml-1">{insumo.unidadMedida}/mes</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-coffee-300 text-coffee-700 hover:bg-coffee-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
