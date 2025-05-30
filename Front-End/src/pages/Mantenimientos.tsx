
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
import { Plus, Search, Edit, Calendar, Coffee, Wrench, AlertTriangle } from "lucide-react"

const mockMantenimientos = [
  {
    id: 1,
    fecha: "2024-01-26",
    tipo: "Preventivo",
    maquina: "MAQ-001",
    cliente: "Oficinas Central",
    tecnico: "Juan Carlos Mendez",
    estado: "Completado",
    observaciones: "Limpieza general y calibración realizada correctamente.",
    prioridad: "Normal"
  },
  {
    id: 2,
    fecha: "2024-01-27",
    tipo: "Correctivo",
    maquina: "MAQ-025",
    cliente: "Hotel Plaza",
    tecnico: "María Elena Vásquez",
    estado: "En Proceso",
    observaciones: "Problema con el sistema de dosificación de café.",
    prioridad: "Urgente"
  },
  {
    id: 3,
    fecha: "2024-01-28",
    tipo: "Preventivo",
    maquina: "MAQ-015",
    cliente: "Hospital Regional",
    tecnico: "Roberto Silva",
    estado: "Programado",
    observaciones: "Mantenimiento mensual programado.",
    prioridad: "Normal"
  },
  {
    id: 4,
    fecha: "2024-01-25",
    tipo: "Instalación",
    maquina: "MAQ-045",
    cliente: "Centro Comercial Norte",
    tecnico: "Ana Beatriz Torres",
    estado: "Completado",
    observaciones: "Nueva instalación completada con éxito. Capacitación al personal realizada.",
    prioridad: "Normal"
  },
  {
    id: 5,
    fecha: "2024-01-29",
    tipo: "Correctivo",
    maquina: "MAQ-033",
    cliente: "Universidad Norte",
    tecnico: "Diego Ramírez",
    estado: "Programado",
    observaciones: "Revisión por posible falla en el sistema de calentamiento.",
    prioridad: "Alta"
  }
]

export default function Mantenimientos() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMantenimientos = mockMantenimientos.filter(mantenimiento =>
    mantenimiento.maquina.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mantenimiento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mantenimiento.tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mantenimiento.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "Completado":
        return "bg-green-100 text-green-800 border-green-300"
      case "En Proceso":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Programado":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Cancelado":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getPrioridadBadgeColor = (prioridad: string) => {
    switch (prioridad) {
      case "Urgente":
        return "bg-red-100 text-red-800 border-red-300"
      case "Alta":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "Normal":
        return "bg-green-100 text-green-800 border-green-300"
      case "Baja":
        return "bg-gray-100 text-gray-800 border-gray-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Preventivo":
        return Calendar
      case "Correctivo":
        return AlertTriangle
      case "Instalación":
        return Coffee
      default:
        return Wrench
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Mantenimientos</h1>
          <p className="text-coffee-600 mt-1">Programa y controla los mantenimientos de máquinas</p>
        </div>
        <Button className="bg-coffee-600 hover:bg-coffee-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Mantenimiento
        </Button>
      </div>

      {/* Buscador */}
      <Card className="bg-white border-coffee-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
            <Input
              placeholder="Buscar mantenimientos por máquina, cliente, técnico o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-coffee-200 focus:border-coffee-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de mantenimientos */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Lista de Mantenimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-coffee-700">Fecha & Tipo</TableHead>
                <TableHead className="text-coffee-700">Máquina & Cliente</TableHead>
                <TableHead className="text-coffee-700">Técnico</TableHead>
                <TableHead className="text-coffee-700">Estado</TableHead>
                <TableHead className="text-coffee-700">Prioridad</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMantenimientos.map((mantenimiento) => {
                const IconComponent = getTipoIcon(mantenimiento.tipo)
                
                return (
                  <TableRow key={mantenimiento.id} className="hover:bg-coffee-50">
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-coffee-600" />
                          <span className="font-medium text-coffee-800">
                            {new Date(mantenimiento.fecha).toLocaleDateString('es-AR')}
                          </span>
                        </div>
                        <div className="text-sm text-coffee-600 mt-1">{mantenimiento.tipo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-coffee-800">{mantenimiento.maquina}</div>
                        <div className="text-sm text-coffee-600">{mantenimiento.cliente}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-coffee-700">{mantenimiento.tecnico}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={getEstadoBadgeColor(mantenimiento.estado)}
                      >
                        {mantenimiento.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={getPrioridadBadgeColor(mantenimiento.prioridad)}
                      >
                        {mantenimiento.prioridad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-coffee-300 text-coffee-700 hover:bg-coffee-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Observaciones expandibles */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Observaciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMantenimientos.slice(0, 3).map((mantenimiento) => (
              <div key={mantenimiento.id} className="p-3 bg-coffee-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-coffee-800">
                    {mantenimiento.maquina} - {mantenimiento.cliente}
                  </div>
                  <div className="text-sm text-coffee-600">
                    {new Date(mantenimiento.fecha).toLocaleDateString('es-AR')}
                  </div>
                </div>
                <p className="text-sm text-coffee-700">{mantenimiento.observaciones}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
