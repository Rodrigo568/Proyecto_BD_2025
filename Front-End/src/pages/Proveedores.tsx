import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Edit, Truck } from "lucide-react"
import api from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function Proveedores() {
  const [searchTerm, setSearchTerm] = useState("")
  const [proveedores, setProveedores] = useState<{ id_proveedor: number, nombre: string }[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [loading, setLoading] = useState(false)
  const [editProveedor, setEditProveedor] = useState<{ id_proveedor: number, nombre: string } | null>(null)

  useEffect(() => {
    api.get('/proveedores')
      .then(response => {
        setProveedores(response.data)
      })
      .catch(error => {
        console.error("Error fetching proveedores:", error)
        setProveedores([])
      })
  }, [])

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNuevoProveedor = async () => {
    if (!nuevoNombre.trim()) return
    setLoading(true)
    try {
      if (editProveedor) {
        // Editar proveedor existente
        const response = await api.put(`/proveedores/${editProveedor.id_proveedor}`, { nombre: nuevoNombre })
        setProveedores(prev =>
          prev.map(p =>
            p.id_proveedor === editProveedor.id_proveedor ? response.data : p
          )
        )
      } else {
        // Crear nuevo proveedor
        const response = await api.post('/proveedores', { nombre: nuevoNombre })
        setProveedores(prev => [...prev, response.data])
      }
      setModalOpen(false)
      setNuevoNombre("")
      setEditProveedor(null)
    } catch (error) {
      console.error("Error guardando proveedor:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditarClick = (proveedor: { id_proveedor: number, nombre: string }) => {
    setEditProveedor(proveedor)
    setNuevoNombre(proveedor.nombre)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setNuevoNombre("")
    setEditProveedor(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Proveedores</h1>
          <p className="text-coffee-600 mt-1">Administra tus proveedores de insumos</p>
        </div>
        <Button
          className="bg-coffee-600 hover:bg-coffee-700 text-white"
          onClick={() => {
            setEditProveedor(null)
            setNuevoNombre("")
            setModalOpen(true)
          }}
        >
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
              placeholder="Buscar proveedores por nombre..."
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
                <TableHead className="text-coffee-700">ID</TableHead>
                <TableHead className="text-coffee-700">Proveedor</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor.id_proveedor} className="hover:bg-coffee-50">
                  <TableCell>{proveedor.id_proveedor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-coffee-600" />
                      <span className="font-medium text-coffee-800">{proveedor.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-coffee-300 text-coffee-700 hover:bg-coffee-50"
                      onClick={() => handleEditarClick(proveedor)}
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

      {/* Modal para nuevo proveedor */}
      <Dialog open={modalOpen} onOpenChange={handleModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nombre del proveedor"
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleNuevoProveedor}
              disabled={loading || !nuevoNombre.trim()}
              className="bg-coffee-600 hover:bg-coffee-700 text-white"
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant="outline"
              onClick={handleModalClose}
              disabled={loading}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
