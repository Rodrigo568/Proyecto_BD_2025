import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit } from "lucide-react"
import api from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Tecnico {
  id_tecnico: number
  nombre: string
  tipo_visita: string
  id_cliente: number
}

export default function Tecnicos() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ nombre: "", tipo_visita: "", id_cliente: 1 })
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("/tecnicos")
      .then(res => {
        console.log("✅ Técnicos cargados:", res.data)
        setTecnicos(res.data)
      })
      .catch(err => {
        console.error("❌ Error al cargar técnicos:", err)
        setTecnicos([])
      })
  }, [])

  const handleOpen = () => {
    setForm({ nombre: "", tipo_visita: "", id_cliente: 1 })
    setEditId(null)
    setModalOpen(true)
  }

  const handleEdit = (tecnico: Tecnico) => {
    setForm({ nombre: tecnico.nombre, tipo_visita: tecnico.tipo_visita, id_cliente: tecnico.id_cliente })
    setEditId(tecnico.id_tecnico)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setForm({ nombre: "", tipo_visita: "", id_cliente: 1 })
    setEditId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: name === "id_cliente" ? Number(value) : value
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (editId !== null) {
        const res = await api.put(`/tecnicos/${editId}`, form)
        setTecnicos(prev => prev.map(t => t.id_tecnico === editId ? res.data : t))
      } else {
        const res = await api.post("/tecnicos", form)
        setTecnicos(prev => [...prev, res.data])
      }
      handleClose()
    } catch (err) {
      alert("❌ Error al guardar técnico")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Técnicos</h1>
          <p className="text-coffee-600 mt-1">Administra tus técnicos registrados</p>
        </div>
        <Button className="bg-coffee-600 text-white hover:bg-coffee-700" onClick={handleOpen}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Técnico
        </Button>
      </div>

      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Lista de Técnicos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-coffee-700">Nombre</TableHead>
                <TableHead className="text-coffee-700">Tipo de Visita</TableHead>
                <TableHead className="text-coffee-700">ID Cliente</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tecnicos.map(tecnico => (
                <TableRow key={tecnico.id_tecnico} className="hover:bg-coffee-50">
                  <TableCell>{tecnico.nombre}</TableCell>
                  <TableCell>{tecnico.tipo_visita}</TableCell>
                  <TableCell>{tecnico.id_cliente}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-coffee-300 text-coffee-700 hover:bg-coffee-50"
                      onClick={() => handleEdit(tecnico)}
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

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Técnico" : "Nuevo Técnico"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <Input
              name="tipo_visita"
              placeholder="Tipo de Visita"
              value={form.tipo_visita}
              onChange={handleChange}
              required
            />
            <Input
              name="id_cliente"
              placeholder="ID del Cliente"
              type="number"
              value={form.id_cliente}
              onChange={handleChange}
              required
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading} className="bg-coffee-600 text-white">
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
