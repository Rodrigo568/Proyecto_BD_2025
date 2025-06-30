
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
import { Plus, Search, Edit, Coffee, MapPin, DollarSign, Lock } from "lucide-react"
import api from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"

interface Maquina {
  id_maquina: number
  modelo: string
  id_cliente: number
  ubicacion_cliente: string
  costo_alquiler_mensual: number
}

interface Cliente {
  id: number
  nombre: string
  direccion?: string
  telefono?: string
  correo?: string
}

export default function Maquinas() {
  const [searchTerm, setSearchTerm] = useState("")
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    modelo: "",
    id_cliente: "",
    ubicacion_cliente: "",
    costo_alquiler_mensual: ""
  })
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const modeloRef = useRef<HTMLInputElement>(null)
  const { isAdmin } = useAuth()

  // Cargar maquinas y clientes al montar el componente
  useEffect(() => {
    // Cargar maquinas
    api.get("/maquinas")
      .then(response => {
        setMaquinas(response.data)
      })
      .catch(error => {
        console.error("Error al obtener las máquinas:", error)
      })

    // Cargar clientes para el select
    api.get("/clientes")
      .then(response => {
        setClientes(response.data)
      })
      .catch(error => {
        console.error("Error al obtener los clientes:", error)
      })
  }, [])

  // Filtrar máquinas según la búsqueda
  const filteredMaquinas = maquinas.filter(maquina =>
    maquina.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maquina.ubicacion_cliente.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Obtener nombre del cliente por ID
  const getClienteNombre = (id_cliente: number) => {
    const cliente = clientes.find(c => c.id === id_cliente)
    return cliente ? cliente.nombre : `Cliente ${id_cliente}`
  }

  const handleOpen = () => {
    setForm({ modelo: "", id_cliente: "", ubicacion_cliente: "", costo_alquiler_mensual: "" })
    setOpen(true)
    setTimeout(() => modeloRef.current?.focus(), 100)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value })
  }

  // Crear máquina desde el form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const maquinaData = {
        ...form,
        id_cliente: parseInt(form.id_cliente),
        costo_alquiler_mensual: parseInt(form.costo_alquiler_mensual)
      }
      const res = await api.post("/maquinas", maquinaData)
      setMaquinas(prev => [...prev, res.data])
      setOpen(false)
    } catch (err) {
      alert("Error al crear máquina")
    } finally {
      setLoading(false)
    }
  }

  const handleEditOpen = (maquina: Maquina) => {
    setForm({
      modelo: maquina.modelo,
      id_cliente: maquina.id_cliente.toString(),
      ubicacion_cliente: maquina.ubicacion_cliente,
      costo_alquiler_mensual: maquina.costo_alquiler_mensual.toString(),
    })
    setEditId(maquina.id_maquina)
    setEditOpen(true)
    setTimeout(() => modeloRef.current?.focus(), 100)
  }

  // Editar máquina desde el form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId == null) return
    setLoading(true)
    try {
      const maquinaData = {
        ...form,
        id_cliente: parseInt(form.id_cliente),
        costo_alquiler_mensual: parseInt(form.costo_alquiler_mensual)
      }
      const res = await api.put(`/maquinas/${editId}`, maquinaData)
      setMaquinas(prev =>
        prev.map(m => (m.id_maquina === editId ? res.data : m))
      )
      setEditOpen(false)
    } catch (err) {
      alert("Error al editar máquina")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Máquinas</h1>
          <p className="text-coffee-600 mt-1">
            {isAdmin ? 'Administra las máquinas expendedoras' : 'Visualiza las máquinas expendedoras'}
          </p>
        </div>
        {isAdmin ? (
          <Button className="bg-coffee-600 hover:bg-coffee-700 text-white" onClick={handleOpen}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Máquina
          </Button>
        ) : (
          <div className="flex items-center text-coffee-600 bg-coffee-50 px-3 py-2 rounded-md">
            <Lock className="h-4 w-4 mr-2" />
            Solo lectura
          </div>
        )}
      </div>

      {/* Modal para nueva máquina */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Máquina</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={modeloRef}
              name="modelo"
              placeholder="Modelo"
              value={form.modelo}
              onChange={handleChange}
              required
            />
            <Select value={form.id_cliente} onValueChange={(value) => handleSelectChange("id_cliente", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="ubicacion_cliente"
              placeholder="Ubicación del cliente"
              value={form.ubicacion_cliente}
              onChange={handleChange}
              required
            />
            <Input
              name="costo_alquiler_mensual"
              placeholder="Costo alquiler mensual"
              type="number"
              value={form.costo_alquiler_mensual}
              onChange={handleChange}
              required
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-coffee-600 hover:bg-coffee-700">
                {loading ? "Creando..." : "Crear Máquina"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para editar máquina */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Máquina</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              ref={modeloRef}
              name="modelo"
              placeholder="Modelo"
              value={form.modelo}
              onChange={handleChange}
              required
            />
            <Select value={form.id_cliente} onValueChange={(value) => handleSelectChange("id_cliente", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="ubicacion_cliente"
              placeholder="Ubicación del cliente"
              value={form.ubicacion_cliente}
              onChange={handleChange}
              required
            />
            <Input
              name="costo_alquiler_mensual"
              placeholder="Costo alquiler mensual"
              type="number"
              value={form.costo_alquiler_mensual}
              onChange={handleChange}
              required
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-coffee-600 hover:bg-coffee-700">
                {loading ? "Actualizando..." : "Actualizar Máquina"}
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
                <TableHead className="text-coffee-700">Cliente</TableHead>
                <TableHead className="text-coffee-700">Ubicación</TableHead>
                <TableHead className="text-coffee-700">Alquiler Mensual</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaquinas.map((maquina) => (
                <TableRow key={maquina.id_maquina} className="hover:bg-coffee-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-coffee-600" />
                      <span className="font-medium text-coffee-800">{maquina.modelo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-coffee-800">{getClienteNombre(maquina.id_cliente)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-coffee-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      {maquina.ubicacion_cliente}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-coffee-700">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-medium">${maquina.costo_alquiler_mensual.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-coffee-300 text-coffee-700 hover:bg-coffee-50"
                        onClick={() => handleEditOpen(maquina)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex items-center text-coffee-400 text-sm">
                        <Lock className="h-3 w-3 mr-1" />
                        Sin permisos
                      </div>
                    )}
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
