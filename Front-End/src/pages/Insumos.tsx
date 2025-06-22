import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit } from "lucide-react"
import api from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Insumo {
  id_insumo: number
  tipo: string
  precio: number
  id_proveedor: number
}

export default function Insumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ tipo: "", precio: 0, id_proveedor: 1 })
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("/insumos")
      .then(res => {
        console.log("✅ Insumos cargados:", res.data)
        setInsumos(res.data)
      })
      .catch(err => {
        console.error("❌ Error al cargar insumos:", err)
        setInsumos([])
      })
  }, [])

  const handleOpen = () => {
    setForm({ tipo: "", precio: 0, id_proveedor: 1 })
    setEditId(null)
    setModalOpen(true)
  }

  const handleEdit = (insumo: Insumo) => {
    setForm({ tipo: insumo.tipo, precio: insumo.precio, id_proveedor: insumo.id_proveedor })
    setEditId(insumo.id_insumo)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setForm({ tipo: "", precio: 0, id_proveedor: 1 })
    setEditId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: name === "precio" || name === "id_proveedor" ? Number(value) : value
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (editId !== null) {
        const res = await api.put(`/insumos/${editId}`, form)
        setInsumos(prev => prev.map(i => i.id_insumo === editId ? res.data : i))
      } else {
        const res = await api.post("/insumos", form)
        setInsumos(prev => [...prev, res.data])
      }
      handleClose()
    } catch (err) {
      alert("❌ Error al guardar insumo")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">Gestión de Insumos</h1>
          <p className="text-coffee-600 mt-1">Administra tus insumos</p>
        </div>
        <Button className="bg-coffee-600 text-white hover:bg-coffee-700" onClick={handleOpen}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Insumo
        </Button>
      </div>

      <Card className="bg-white border-coffee-200">
        <CardHeader>
          <CardTitle className="text-coffee-800">Lista de Insumos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-coffee-700">Tipo</TableHead>
                <TableHead className="text-coffee-700">Precio</TableHead>
                <TableHead className="text-coffee-700">ID Proveedor</TableHead>
                <TableHead className="text-coffee-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insumos.map(insumo => (
                <TableRow key={insumo.id_insumo} className="hover:bg-coffee-50">
                  <TableCell>{insumo.tipo}</TableCell>
                  <TableCell>${insumo.precio}</TableCell>
                  <TableCell>{insumo.id_proveedor}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-coffee-300 text-coffee-700 hover:bg-coffee-50"
                      onClick={() => handleEdit(insumo)}
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
            <DialogTitle>{editId ? "Editar Insumo" : "Nuevo Insumo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="tipo"
              placeholder="Tipo"
              value={form.tipo}
              onChange={handleChange}
              required
            />
            <Input
              name="precio"
              placeholder="Precio"
              type="number"
              value={form.precio}
              onChange={handleChange}
              required
            />
            <Input
              name="id_proveedor"
              placeholder="ID del proveedor"
              type="number"
              value={form.id_proveedor}
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
