
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
import { Plus, Search, Edit, Wrench, Phone, Mail, Calendar } from "lucide-react"

const mockTecnicos = [
  {
    id: 1,
    nombre: "Juan Carlos Mendez",
    telefono: "+54 11 5555-1111",
    email: "jmendez@cafesmarloy.com",
    especialidad: "Mantenimiento Preventivo",
    zona: "CABA y GBA Norte",
    mantenimientosRealizados: 45,
    estado: "Disponible",
    ultimoMantenimiento: "2024-01-25"
  },
  {
    id: 2,
    nombre: "María Elena Vásquez",
    telefono: "+54 11 5555-2222",
    email: "mvasquez@cafesmarloy.com",
    especialidad: "Reparaciones Urgentes",
    zona: "CABA y GBA Sur",
    mantenimientosRealizados: 38,
    estado: "En Servicio",
    ultimoMantenimiento: "2024-01-26"
  },
  {
    id: 3,
    nombre: "Roberto Silva",
    telefono: "+54 341 5555-3333",
    email: "rsilva@cafesmarloy.com",
    especialidad: "Instalación y Configuración",
    zona: "Rosario y Alrededores",
    mantenimientosRealizados: 29,
    estado: "Disponible",
    ultimoMantenimiento: "2024-01-24"
  },
  {
    id: 4,
    nombre: "Ana Beatriz Torres",
    telefono: "+54 351 5555-4444",
    email: "atorres@cafesmarloy.com",
    especialidad: "Mantenimiento Preventivo",
    zona: "Córdoba Capital",
    mantenimientosRealizados: 52,
    estado: "Disponible",
    ultimoMantenimiento: "2024-01-23"
  },
  {
    id: 5,
    nombre: "Diego Ramírez",
    telefono: "+54 261 5555-5555",
    email: "dramirez@cafesmarloy.com",
    especialidad: "Reparaciones Complejas",
    zona: "Mendoza y San Juan",
    mantenimientosRealizados: 31,
    estado: "De Vacaciones",
    ultimoMantenimiento: "2024-01-15"
  }
]

export default function Tecnicos() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTecnicos = mockTecnicos.filter(tecnico =>
    tecnico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tecnico.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tecnico.zona.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return "bg-green-100 text-green-800 border-green-300"
      case "En Servicio":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "De Vacaciones":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "No Disponible":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Técnicos</h1>
          <p className="text-coffee-600 mt-1">Administra el equipo técnico de mantenimiento</p>
        </div>
        <Button className="bg-coffee-600 hover:bg-coffee-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Técnico
        </Button>
      </div>

      {/* Buscador */}
      <Card className="bg-white border-coffee-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
            <Input
              placeholder="Buscar técnicos por nombre, especialidad o zona..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-coffee-200 focus:border-coffee-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de técnicos */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Lista de Técnicos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-coffee-700">Técnico</TableHead>
                <TableHead className="text-coffee-700">Contacto</TableHead>
                <TableHead className="text-coffee-700">Especialidad & Zona</TableHead>
                <TableHead className="text-coffee-700">Rendimiento</TableHead>
                <TableHead className="text-coffee-700">Estado</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTecnicos.map((tecnico) => (
                <TableRow key={tecnico.id} className="hover:bg-coffee-50">
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-coffee-600" />
                        <span className="font-medium text-coffee-800">{tecnico.nombre}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-coffee-600">
                        <Phone className="h-3 w-3 mr-2" />
                        {tecnico.telefono}
                      </div>
                      <div className="flex items-center text-sm text-coffee-600">
                        <Mail className="h-3 w-3 mr-2" />
                        {tecnico.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-coffee-800">{tecnico.especialidad}</div>
                      <div className="text-sm text-coffee-600">{tecnico.zona}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-coffee-800">
                        {tecnico.mantenimientosRealizados} servicios
                      </div>
                      <div className="flex items-center text-sm text-coffee-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        Último: {new Date(tecnico.ultimoMantenimiento).toLocaleDateString('es-AR')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={getEstadoBadgeColor(tecnico.estado)}
                    >
                      {tecnico.estado}
                    </Badge>
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
