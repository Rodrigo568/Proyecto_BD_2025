import { useState, useEffect, useRef } from "react"
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
import { Plus, Search, Edit, MapPin, Phone, Mail, User, Settings } from "lucide-react"
import api from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Cliente {
  id: number
  nombre: string
  direccion?: string
  telefono?: string
  correo?: string
}

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({nombre: "", direccion: "", telefono: "", correo: "" })
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const nombreRef = useRef<HTMLInputElement>(null)


  // cargar clientes al montar el componente 
  useEffect(() => {
    api.get("/clientes")
      .then(response => {
        setClientes(response.data)
      })
      .catch(error => {
        console.error("Error al obtener los clientes:", error)
      })
  }, [])

  // Filtrar clientes segegun la busqueda
  const filteredCustomers = clientes.filter(cliente =>
    cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.correo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpen = () => {
    setForm({ nombre: "", direccion: "", telefono: "", correo: "" })
    setOpen(true)
    setTimeout(() => nombreRef.current?.focus(), 100)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // crear cliente desde el form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post("/clientes", form)
      setClientes(prev => [...prev, res.data])
      setOpen(false)
    } catch (err) {
      alert("Error al crear cliente")
    } finally {
      setLoading(false)
    }
  }

  const handleEditOpen = (cliente: Cliente) => {
    setForm({
      nombre: cliente.nombre,
      direccion: cliente.direccion || "",
      telefono: cliente.telefono || "",
      correo: cliente.correo || "",
    })
    setEditId(cliente.id)
    setEditOpen(true)
    setTimeout(() => nombreRef.current?.focus(), 100)
  }

  // editar cliente desde el form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId == null) return
    setLoading(true)
    try {
      const res = await api.put(`/clientes/${editId}`, form)
      setClientes(prev =>
        prev.map(c => (c.id === editId ? res.data : c))
      )
      setEditOpen(false)
    } catch (err) {
      alert("Error al editar cliente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Clientes</h1>
          <p className="text-coffee-600 mt-1">Administra la información de tus clientes</p>
        </div>
        <Button className="bg-coffee-600 hover:bg-coffee-700 text-white" onClick={handleOpen}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Modal para nuevo cliente */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={nombreRef}
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <Input
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
            />
            <Input
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
            <Input
              name="correo"
              placeholder="Correo"
              value={form.correo}
              onChange={handleChange}
              required
              type="email"
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-coffee-600 text-white">
                {loading ? "Guardando..." : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para editar cliente */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              ref={nombreRef}
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <Input
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
            />
            <Input
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
            <Input
              name="correo"
              placeholder="Correo"
              value={form.correo}
              onChange={handleChange}
              required
              type="email"
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-coffee-600 text-white">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Buscador */}
      <Card className="bg-white border-coffee-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes por nombre, dirección o correo..."
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
                <TableHead className="text-coffee-700">Dirección</TableHead>
                <TableHead className="text-coffee-700">Teléfono</TableHead>
                <TableHead className="text-coffee-700">Correo</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((cliente) => (
                <TableRow key={cliente.id} className="hover:bg-coffee-50">
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-coffee-500" />
                      <div>
                        <div className="font-medium text-coffee-800">{cliente.nombre}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center text-sm text-coffee-600">
                      <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span>{cliente.direccion || 'Sin dirección'}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center text-sm text-coffee-600">
                      <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span>{cliente.telefono || 'Sin teléfono'}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center text-sm text-coffee-600">
                      <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span>{cliente.correo || 'Sin correo'}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-coffee-300 text-coffee-700 hover:bg-coffee-50"
                      onClick={() => handleEditOpen(cliente)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-coffee-500">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron clientes</p>
              {searchTerm && (
                <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}