
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
import { Plus, Search, Edit, MapPin, Phone, Mail } from "lucide-react"

const mockClientes = [
  {
    id: 1,
    nombre: "Oficinas Central",
    direccion: "Av. Libertador 1234, CABA",
    telefono: "+54 11 4567-8901",
    email: "contacto@oficinascentral.com",
    maquinas: 3,
    estado: "Activo"
  },
  {
    id: 2,
    nombre: "Hospital Regional",
    direccion: "Calle Salud 567, Buenos Aires",
    telefono: "+54 11 4567-8902",
    email: "admin@hospitalregional.com",
    maquinas: 5,
    estado: "Activo"
  },
  {
    id: 3,
    nombre: "Universidad Norte",
    direccion: "Campus Universitario 789, Córdoba",
    telefono: "+54 351 456-7890",
    email: "servicios@uninorte.edu.ar",
    maquinas: 8,
    estado: "Activo"
  },
  {
    id: 4,
    nombre: "Hotel Plaza",
    direccion: "Plaza Mayor 123, Mendoza",
    telefono: "+54 261 456-7890",
    email: "gerencia@hotelplaza.com",
    maquinas: 2,
    estado: "Inactivo"
  }
]

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClientes = mockClientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Clientes</h1>
          <p className="text-coffee-600 mt-1">Administra la información de tus clientes</p>
        </div>
        <Button className="bg-coffee-600 hover:bg-coffee-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Buscador */}
      <Card className="bg-white border-coffee-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes por nombre o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-coffee-200 focus:border-coffee-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de clientes */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-coffee-700">Cliente</TableHead>
                <TableHead className="text-coffee-700">Contacto</TableHead>
                <TableHead className="text-coffee-700">Máquinas</TableHead>
                <TableHead className="text-coffee-700">Estado</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id} className="hover:bg-coffee-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-coffee-800">{cliente.nombre}</div>
                      <div className="flex items-center text-sm text-coffee-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {cliente.direccion}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-coffee-600">
                        <Phone className="h-3 w-3 mr-2" />
                        {cliente.telefono}
                      </div>
                      <div className="flex items-center text-sm text-coffee-600">
                        <Mail className="h-3 w-3 mr-2" />
                        {cliente.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-coffee-300 text-coffee-700">
                      {cliente.maquinas} máquinas
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={cliente.estado === "Activo" ? "default" : "secondary"}
                      className={cliente.estado === "Activo" 
                        ? "bg-green-100 text-green-800 border-green-300" 
                        : "bg-gray-100 text-gray-800 border-gray-300"
                      }
                    >
                      {cliente.estado}
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
