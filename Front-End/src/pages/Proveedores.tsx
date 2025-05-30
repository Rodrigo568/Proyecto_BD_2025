
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
import { Plus, Search, Edit, Truck, Phone, Mail, Package } from "lucide-react"

const mockProveedores = [
  {
    id: 1,
    nombre: "Café del Valle S.A.",
    contacto: "Roberto Martínez",
    telefono: "+54 11 4321-5678",
    email: "ventas@cafedelvalle.com",
    direccion: "Av. Industria 456, Buenos Aires",
    insumosPrincipales: ["Café Premium", "Café Descafeinado"],
    estado: "Activo",
    ultimaCompra: "2024-01-20"
  },
  {
    id: 2,
    nombre: "Lácteos Buenos Aires",
    contacto: "María González",
    telefono: "+54 11 4567-1234",
    email: "comercial@lacteosba.com",
    direccion: "Ruta 5 Km 25, La Plata",
    insumosPrincipales: ["Leche en Polvo", "Crema en Polvo"],
    estado: "Activo",
    ultimaCompra: "2024-01-18"
  },
  {
    id: 3,
    nombre: "Azucarera Central",
    contacto: "Carlos Rodríguez",
    telefono: "+54 341 456-7890",
    email: "info@azucareracentral.com",
    direccion: "Parque Industrial Norte, Rosario",
    insumosPrincipales: ["Azúcar Refinada", "Edulcorante"],
    estado: "Activo",
    ultimaCompra: "2024-01-15"
  },
  {
    id: 4,
    nombre: "Chocolates del Sur",
    contacto: "Ana Pérez",
    telefono: "+54 261 789-0123",
    email: "ventas@chocolatesdelsur.com",
    direccion: "Zona Industrial Este, Mendoza",
    insumosPrincipales: ["Chocolate en Polvo", "Cacao"],
    estado: "Activo",
    ultimaCompra: "2024-01-22"
  },
  {
    id: 5,
    nombre: "Especias Aromáticas",
    contacto: "Luis Torres",
    telefono: "+54 351 234-5678",
    email: "contacto@especiasaromaticas.com",
    direccion: "Barrio Industrial, Córdoba",
    insumosPrincipales: ["Canela Molida", "Vainilla"],
    estado: "Inactivo",
    ultimaCompra: "2023-12-10"
  }
]

export default function Proveedores() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProveedores = mockProveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.insumosPrincipales.some(insumo => 
      insumo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Proveedores</h1>
          <p className="text-coffee-600 mt-1">Administra tus proveedores de insumos</p>
        </div>
        <Button className="bg-coffee-600 hover:bg-coffee-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Buscador */}
      <Card className="bg-white border-coffee-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
            <Input
              placeholder="Buscar proveedores por nombre, contacto o insumos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-coffee-200 focus:border-coffee-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de proveedores */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Lista de Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-coffee-700">Proveedor</TableHead>
                <TableHead className="text-coffee-700">Contacto</TableHead>
                <TableHead className="text-coffee-700">Insumos Principales</TableHead>
                <TableHead className="text-coffee-700">Estado</TableHead>
                <TableHead className="text-coffee-700">Última Compra</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor.id} className="hover:bg-coffee-50">
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-coffee-600" />
                        <span className="font-medium text-coffee-800">{proveedor.nombre}</span>
                      </div>
                      <div className="text-sm text-coffee-600 mt-1">{proveedor.direccion}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-coffee-800">{proveedor.contacto}</div>
                      <div className="flex items-center text-sm text-coffee-600">
                        <Phone className="h-3 w-3 mr-2" />
                        {proveedor.telefono}
                      </div>
                      <div className="flex items-center text-sm text-coffee-600">
                        <Mail className="h-3 w-3 mr-2" />
                        {proveedor.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {proveedor.insumosPrincipales.map((insumo, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="border-coffee-300 text-coffee-700 mr-1"
                        >
                          <Package className="h-3 w-3 mr-1" />
                          {insumo}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={proveedor.estado === "Activo" ? "default" : "secondary"}
                      className={proveedor.estado === "Activo" 
                        ? "bg-green-100 text-green-800 border-green-300" 
                        : "bg-gray-100 text-gray-800 border-gray-300"
                      }
                    >
                      {proveedor.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-coffee-700">
                      {new Date(proveedor.ultimaCompra).toLocaleDateString('es-AR')}
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
