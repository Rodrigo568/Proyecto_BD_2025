
import { useState, useEffect } from "react"
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
import { Plus, Search, Edit, Calendar, Coffee, Wrench, AlertTriangle, Lock } from "lucide-react"
import api from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"

interface Mantenimiento {
  id_mantenimiento: number
  id_maquina: number
  id_tecnico: number
  tipo: string
  fecha: string
  observaciones?: string
}

interface Maquina {
  id_maquina: number
  modelo: string
  id_cliente: number
  ubicacion_cliente: string
  costo_alquiler_mensual: number
}

interface Tecnico {
  id_tecnico: number
  nombre: string
  tipo_visita: string
  id_cliente: number
}

interface Cliente {
  id: number
  nombre: string
  direccion?: string
  telefono?: string
  correo?: string
}

export default function Mantenimientos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    id_maquina: "",
    id_tecnico: "",
    tipo: "",
    fecha: "",
    observaciones: ""
  })
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAdmin } = useAuth()

  // Cargar datos al montar el componente
  useEffect(() => {
    // Cargar mantenimientos
    api.get("/mantenimientos")
      .then(response => {
        setMantenimientos(response.data)
      })
      .catch(error => {
        console.error("Error al obtener mantenimientos:", error)
      })

    // Cargar máquinas
    api.get("/maquinas")
      .then(response => {
        setMaquinas(response.data)
      })
      .catch(error => {
        console.error("Error al obtener máquinas:", error)
      })

    // Cargar técnicos
    api.get("/tecnicos")
      .then(response => {
        setTecnicos(response.data)
      })
      .catch(error => {
        console.error("Error al obtener técnicos:", error)
      })

    // Cargar clientes
    api.get("/clientes")
      .then(response => {
        setClientes(response.data)
      })
      .catch(error => {
        console.error("Error al obtener clientes:", error)
      })
  }, [])

  // Obtener información de la máquina por ID
  const getMaquinaInfo = (id_maquina: number) => {
    const maquina = maquinas.find(m => m.id_maquina === id_maquina)
    return maquina || { modelo: `Máquina ${id_maquina}`, id_cliente: 0, ubicacion_cliente: '', costo_alquiler_mensual: 0, id_maquina: id_maquina }
  }

  // Obtener nombre del técnico por ID
  const getTecnicoNombre = (id_tecnico: number) => {
    const tecnico = tecnicos.find(t => t.id_tecnico === id_tecnico)
    return tecnico ? tecnico.nombre : `Técnico ${id_tecnico}`
  }

  // Obtener nombre del cliente por ID
  const getClienteNombre = (id_cliente: number) => {
    const cliente = clientes.find(c => c.id === id_cliente)
    return cliente ? cliente.nombre : `Cliente ${id_cliente}`
  }

  // Filtrar mantenimientos según la búsqueda
  const filteredMantenimientos = mantenimientos.filter(mantenimiento => {
    const maquinaInfo = getMaquinaInfo(mantenimiento.id_maquina)
    const tecnicoNombre = getTecnicoNombre(mantenimiento.id_tecnico)
    const clienteNombre = getClienteNombre(maquinaInfo.id_cliente)
    
    return (
      mantenimiento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maquinaInfo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tecnicoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mantenimiento.observaciones && mantenimiento.observaciones.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const handleOpen = () => {
    setForm({ id_maquina: "", id_tecnico: "", tipo: "", fecha: "", observaciones: "" })
    setOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value })
  }

  // Crear mantenimiento desde el form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const mantenimientoData = {
        ...form,
        id_maquina: parseInt(form.id_maquina),
        id_tecnico: parseInt(form.id_tecnico),
        fecha: new Date(form.fecha).toISOString()
      }
      const res = await api.post("/mantenimientos", mantenimientoData)
      setMantenimientos(prev => [...prev, res.data])
      setOpen(false)
    } catch (err) {
      alert("Error al crear mantenimiento")
    } finally {
      setLoading(false)
    }
  }

  const handleEditOpen = (mantenimiento: Mantenimiento) => {
    setForm({
      id_maquina: mantenimiento.id_maquina.toString(),
      id_tecnico: mantenimiento.id_tecnico.toString(),
      tipo: mantenimiento.tipo,
      fecha: new Date(mantenimiento.fecha).toISOString().slice(0, 16),
      observaciones: mantenimiento.observaciones || "",
    })
    setEditId(mantenimiento.id_mantenimiento)
    setEditOpen(true)
  }

  // Editar mantenimiento desde el form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId == null) return
    setLoading(true)
    try {
      const mantenimientoData = {
        ...form,
        id_maquina: parseInt(form.id_maquina),
        id_tecnico: parseInt(form.id_tecnico),
        fecha: new Date(form.fecha).toISOString()
      }
      const res = await api.put(`/mantenimientos/${editId}`, mantenimientoData)
      setMantenimientos(prev =>
        prev.map(m => (m.id_mantenimiento === editId ? res.data : m))
      )
      setEditOpen(false)
    } catch (err) {
      alert("Error al editar mantenimiento")
    } finally {
      setLoading(false)
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
          <p className="text-coffee-600 mt-1">
            {isAdmin ? 'Programa y controla los mantenimientos de máquinas' : 'Visualiza los mantenimientos de máquinas'}
          </p>
        </div>
        {isAdmin ? (
          <Button className="bg-coffee-600 hover:bg-coffee-700 text-white" onClick={handleOpen}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Mantenimiento
          </Button>
        ) : (
          <div className="flex items-center text-coffee-600 bg-coffee-50 px-3 py-2 rounded-md">
            <Lock className="h-4 w-4 mr-2" />
            Solo lectura
          </div>
        )}
      </div>

      {/* Modal para nuevo mantenimiento */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Mantenimiento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Mantenimiento</Label>
              <Select value={form.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventivo">Preventivo</SelectItem>
                  <SelectItem value="Correctivo">Correctivo</SelectItem>
                  <SelectItem value="Instalación">Instalación</SelectItem>
                  <SelectItem value="Revisión">Revisión</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="id_maquina">Máquina</Label>
              <Select value={form.id_maquina} onValueChange={(value) => handleSelectChange("id_maquina", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar máquina" />
                </SelectTrigger>
                <SelectContent>
                  {maquinas.map((maquina) => (
                    <SelectItem key={maquina.id_maquina} value={maquina.id_maquina.toString()}>
                      {maquina.modelo} - {getClienteNombre(maquina.id_cliente)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="id_tecnico">Técnico</Label>
              <Select value={form.id_tecnico} onValueChange={(value) => handleSelectChange("id_tecnico", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar técnico" />
                </SelectTrigger>
                <SelectContent>
                  {tecnicos.map((tecnico) => (
                    <SelectItem key={tecnico.id_tecnico} value={tecnico.id_tecnico.toString()}>
                      {tecnico.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fecha">Fecha y Hora</Label>
              <Input
                name="fecha"
                type="datetime-local"
                value={form.fecha}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                name="observaciones"
                placeholder="Observaciones del mantenimiento"
                value={form.observaciones}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-coffee-600 hover:bg-coffee-700">
                {loading ? "Creando..." : "Crear Mantenimiento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para editar mantenimiento */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Mantenimiento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Mantenimiento</Label>
              <Select value={form.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventivo">Preventivo</SelectItem>
                  <SelectItem value="Correctivo">Correctivo</SelectItem>
                  <SelectItem value="Instalación">Instalación</SelectItem>
                  <SelectItem value="Revisión">Revisión</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="id_maquina">Máquina</Label>
              <Select value={form.id_maquina} onValueChange={(value) => handleSelectChange("id_maquina", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar máquina" />
                </SelectTrigger>
                <SelectContent>
                  {maquinas.map((maquina) => (
                    <SelectItem key={maquina.id_maquina} value={maquina.id_maquina.toString()}>
                      {maquina.modelo} - {getClienteNombre(maquina.id_cliente)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="id_tecnico">Técnico</Label>
              <Select value={form.id_tecnico} onValueChange={(value) => handleSelectChange("id_tecnico", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar técnico" />
                </SelectTrigger>
                <SelectContent>
                  {tecnicos.map((tecnico) => (
                    <SelectItem key={tecnico.id_tecnico} value={tecnico.id_tecnico.toString()}>
                      {tecnico.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fecha">Fecha y Hora</Label>
              <Input
                name="fecha"
                type="datetime-local"
                value={form.fecha}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                name="observaciones"
                placeholder="Observaciones del mantenimiento"
                value={form.observaciones}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-coffee-600 hover:bg-coffee-700">
                {loading ? "Actualizando..." : "Actualizar Mantenimiento"}
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
                <TableHead className="text-coffee-700">Observaciones</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMantenimientos.map((mantenimiento) => {
                const IconComponent = getTipoIcon(mantenimiento.tipo)
                const maquinaInfo = getMaquinaInfo(mantenimiento.id_maquina)
                const tecnicoNombre = getTecnicoNombre(mantenimiento.id_tecnico)
                const clienteNombre = getClienteNombre(maquinaInfo.id_cliente)
                
                return (
                  <TableRow key={mantenimiento.id_mantenimiento} className="hover:bg-coffee-50">
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
                        <div className="font-medium text-coffee-800">{maquinaInfo.modelo}</div>
                        <div className="text-sm text-coffee-600">{clienteNombre}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-coffee-700">{tecnicoNombre}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-coffee-600 max-w-xs truncate">
                        {mantenimiento.observaciones || 'Sin observaciones'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAdmin && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-coffee-300 text-coffee-700 hover:bg-coffee-50"
                          onClick={() => handleEditOpen(mantenimiento)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      )}
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
            {filteredMantenimientos.slice(0, 3).map((mantenimiento) => {
              const maquinaInfo = getMaquinaInfo(mantenimiento.id_maquina)
              const clienteNombre = getClienteNombre(maquinaInfo.id_cliente)
              
              return (
                <div key={mantenimiento.id_mantenimiento} className="p-3 bg-coffee-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-coffee-800">
                      {maquinaInfo.modelo} - {clienteNombre}
                    </div>
                    <div className="text-sm text-coffee-600">
                      {new Date(mantenimiento.fecha).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                  <p className="text-sm text-coffee-700">
                    {mantenimiento.observaciones || 'Sin observaciones'}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
