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
import { Plus, Search, Edit, Calendar, Coffee, Package, DollarSign, Lock } from "lucide-react"
import api from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"

interface Consumo {
  id_consumo: number
  fecha: string
  id_maquina: number
  cobro_mensual: number
  id_insumo: number
}

interface Maquina {
  id_maquina: number
  modelo: string
  id_cliente: number
  ubicacion_cliente: string
  costo_alquiler_mensual: number
}

interface Insumo {
  id_insumo: number
  tipo: string
  precio: number
  id_proveedor: number
}

interface Cliente {
  id: number
  nombre: string
  direccion?: string
  telefono?: string
  correo?: string
}

export default function Consumos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [consumos, setConsumos] = useState<Consumo[]>([])
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    fecha: "",
    id_maquina: "",
    cobro_mensual: "",
    id_insumo: ""
  })
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAdmin } = useAuth()

  useEffect(() => {
    // Cargar consumos
    api.get("/consumos")
      .then(response => {
        setConsumos(response.data)
      })
      .catch(error => {
        console.error("Error al obtener consumos:", error)
      })

    // Cargar máquinas
    api.get("/maquinas")
      .then(response => {
        setMaquinas(response.data)
      })
      .catch(error => {
        console.error("Error al obtener máquinas:", error)
      })

    // Cargar insumos
    api.get("/insumos")
      .then(response => {
        setInsumos(response.data)
      })
      .catch(error => {
        console.error("Error al obtener insumos:", error)
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

  // Obtener información del insumo por ID
  const getInsumoInfo = (id_insumo: number) => {
    const insumo = insumos.find(i => i.id_insumo === id_insumo)
    return insumo ? insumo.tipo : `Insumo ${id_insumo}`
  }

  // Obtener nombre del cliente por ID
  const getClienteNombre = (id_cliente: number) => {
    const cliente = clientes.find(c => c.id === id_cliente)
    return cliente ? cliente.nombre : `Cliente ${id_cliente}`
  }

  // Filtrar consumos según la búsqueda
  const filteredConsumos = consumos.filter(consumo => {
    const maquinaInfo = getMaquinaInfo(consumo.id_maquina)
    const clienteNombre = getClienteNombre(maquinaInfo.id_cliente)
    const insumoTipo = getInsumoInfo(consumo.id_insumo)
    
    return (
      maquinaInfo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insumoTipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(consumo.fecha).toLocaleDateString('es-AR').includes(searchTerm)
    )
  })

  const handleOpen = () => {
    setForm({ fecha: "", id_maquina: "", cobro_mensual: "", id_insumo: "" })
    setOpen(true)
  }

  const handleEditOpen = (consumo: Consumo) => {
    setForm({
      fecha: new Date(consumo.fecha).toISOString().slice(0, 16),
      id_maquina: consumo.id_maquina.toString(),
      cobro_mensual: consumo.cobro_mensual.toString(),
      id_insumo: consumo.id_insumo.toString()
    })
    setEditId(consumo.id_consumo)
    setEditOpen(true)
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const consumoData = {
        fecha: new Date(form.fecha).toISOString(),
        id_maquina: parseInt(form.id_maquina),
        cobro_mensual: parseFloat(form.cobro_mensual),
        id_insumo: parseInt(form.id_insumo)
      }
      const res = await api.post("/consumos", consumoData)
      setConsumos(prev => [...prev, res.data])
      setOpen(false)
    } catch (err) {
      alert("Error al crear consumo")
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId == null) return
    setLoading(true)
    try {
      const consumoData = {
        fecha: new Date(form.fecha).toISOString(),
        id_maquina: parseInt(form.id_maquina),
        cobro_mensual: parseFloat(form.cobro_mensual),
        id_insumo: parseInt(form.id_insumo)
      }
      const res = await api.put(`/consumos/${editId}`, consumoData)
      setConsumos(prev =>
        prev.map(c => (c.id_consumo === editId ? res.data : c))
      )
      setEditOpen(false)
    } catch (err) {
      alert("Error al editar consumo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Consumos</h1>
          <p className="text-coffee-600 mt-1">
            {isAdmin ? 'Registra y controla el consumo de insumos por máquina' : 'Visualiza el consumo de insumos por máquina'}
          </p>
        </div>
        {isAdmin ? (
          <Button className="bg-coffee-600 hover:bg-coffee-700 text-white" onClick={handleOpen}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Consumo
          </Button>
        ) : (
          <div className="flex items-center text-coffee-600 bg-coffee-50 px-3 py-2 rounded-md">
            <Lock className="h-4 w-4 mr-2" />
            Solo lectura
          </div>
        )}
      </div>

      {/* Modal para nuevo consumo */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Consumo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="id_insumo">Insumo</Label>
              <Select value={form.id_insumo} onValueChange={(value) => handleSelectChange("id_insumo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar insumo" />
                </SelectTrigger>
                <SelectContent>
                  {insumos.map((insumo) => (
                    <SelectItem key={insumo.id_insumo} value={insumo.id_insumo.toString()}>
                      {insumo.tipo} - ${insumo.precio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cobro_mensual">Cobro Mensual</Label>
              <Input
                name="cobro_mensual"
                type="number"
                step="0.01"
                placeholder="Cobro mensual"
                value={form.cobro_mensual}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-coffee-600 hover:bg-coffee-700">
                {loading ? "Creando..." : "Crear Consumo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para editar consumo */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Consumo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
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
              <Label htmlFor="id_insumo">Insumo</Label>
              <Select value={form.id_insumo} onValueChange={(value) => handleSelectChange("id_insumo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar insumo" />
                </SelectTrigger>
                <SelectContent>
                  {insumos.map((insumo) => (
                    <SelectItem key={insumo.id_insumo} value={insumo.id_insumo.toString()}>
                      {insumo.tipo} - ${insumo.precio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cobro_mensual">Cobro Mensual</Label>
              <Input
                name="cobro_mensual"
                type="number"
                step="0.01"
                placeholder="Cobro mensual"
                value={form.cobro_mensual}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-coffee-600 hover:bg-coffee-700">
                {loading ? "Actualizando..." : "Actualizar Consumo"}
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
              placeholder="Buscar consumos por máquina, cliente, insumo o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-coffee-200 focus:border-coffee-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de consumos */}
      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Lista de Consumos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-coffee-700">Fecha</TableHead>
                <TableHead className="text-coffee-700">Máquina & Cliente</TableHead>
                <TableHead className="text-coffee-700">Insumo</TableHead>
                <TableHead className="text-coffee-700">Cobro Mensual</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsumos.map((consumo) => {
                const maquinaInfo = getMaquinaInfo(consumo.id_maquina)
                const clienteNombre = getClienteNombre(maquinaInfo.id_cliente)
                const insumoTipo = getInsumoInfo(consumo.id_insumo)
                
                return (
                  <TableRow key={consumo.id_consumo} className="hover:bg-coffee-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-coffee-600" />
                        <span className="font-medium text-coffee-800">
                          {new Date(consumo.fecha).toLocaleDateString('es-AR')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1">
                          <Coffee className="h-4 w-4 text-coffee-600" />
                          <span className="font-medium text-coffee-800">{maquinaInfo.modelo}</span>
                        </div>
                        <div className="text-sm text-coffee-600">{clienteNombre}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-coffee-600" />
                        <span className="font-medium text-coffee-800">{insumoTipo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-coffee-700">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-medium">${consumo.cobro_mensual.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-coffee-300 text-coffee-700 hover:bg-coffee-50"
                          onClick={() => handleEditOpen(consumo)}
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
                )
              })}
            </TableBody>
          </Table>

          {filteredConsumos.length === 0 && (
            <div className="text-center py-8 text-coffee-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron consumos</p>
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
