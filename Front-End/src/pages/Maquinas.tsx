
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
import { Plus, Search, Edit, Coffee, MapPin, DollarSign } from "lucide-react"

const mockMaquinas = [
  {
    id: 1,
    codigo: "MAQ-001",
    modelo: "CoffeeMaster Pro",
    cliente: "Oficinas Central",
    ubicacion: "Planta Baja - Hall Principal",
    alquilerMensual: 15000,
    estado: "Funcionando",
    ultimoMantenimiento: "2024-01-15"
  },
  {
    id: 2,
    codigo: "MAQ-015",
    modelo: "CoffeeMaster Standard",
    cliente: "Hospital Regional",
    ubicacion: "Sala de Espera - Piso 1",
    alquilerMensual: 12000,
    estado: "Funcionando",
    ultimoMantenimiento: "2024-01-20"
  },
  {
    id: 3,
    codigo: "MAQ-033",
    modelo: "CoffeeMaster Plus",
    cliente: "Universidad Norte",
    ubicacion: "Biblioteca Central",
    alquilerMensual: 18000,
    estado: "Funcionando",
    ultimoMantenimiento: "2024-01-10"
  },
  {
    id: 4,
    codigo: "MAQ-025",
    modelo: "CoffeeMaster Pro",
    cliente: "Hotel Plaza",
    ubicacion: "Lobby Principal",
    alquilerMensual: 15000,
    estado: "Mantenimiento",
    ultimoMantenimiento: "2024-01-25"
  }
]

export default function Maquinas() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMaquinas = mockMaquinas.filter(maquina =>
    maquina.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maquina.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maquina.modelo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "Funcionando":
        return "bg-green-100 text-green-800 border-green-300"
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Fuera de Servicio":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Máquinas</h1>
          <p className="text-coffee-600 mt-1">Administra las máquinas expendedoras</p>
        </div>
        <Button className="bg-coffee-600 hover:bg-coffee-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Máquina
        </Button>
      </div>

      {/* Buscador */}
      <Card className="bg-white border-coffee-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
            <Input
              placeholder="Buscar máquinas por código, cliente o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-coffee-200 focus:border-coffee-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de máquinas */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Lista de Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-coffee-700">Máquina</TableHead>
                <TableHead className="text-coffee-700">Ubicación</TableHead>
                <TableHead className="text-coffee-700">Alquiler</TableHead>
                <TableHead className="text-coffee-700">Estado</TableHead>
                <TableHead className="text-coffee-700">Último Mantenimiento</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaquinas.map((maquina) => (
                <TableRow key={maquina.id} className="hover:bg-coffee-50">
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-coffee-600" />
                        <span className="font-medium text-coffee-800">{maquina.codigo}</span>
                      </div>
                      <div className="text-sm text-coffee-600 mt-1">{maquina.modelo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-coffee-800">{maquina.cliente}</div>
                      <div className="flex items-center text-sm text-coffee-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {maquina.ubicacion}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-coffee-700">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-medium">${maquina.alquilerMensual.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-coffee-600">por mes</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={getEstadoBadgeColor(maquina.estado)}
                    >
                      {maquina.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-coffee-700">
                      {new Date(maquina.ultimoMantenimiento).toLocaleDateString('es-AR')}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
