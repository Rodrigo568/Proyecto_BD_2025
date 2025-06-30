import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Coffee, UserPlus, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    contrasenia: '',
    confirmarContrasenia: '',
    cargo: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSelectChange = (value: string) => {
    setForm({ ...form, cargo: value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validaciones
    if (!form.nombre || !form.contrasenia || !form.confirmarContrasenia || !form.cargo) {
      setError('Por favor complete todos los campos')
      setLoading(false)
      return
    }

    if (form.contrasenia !== form.confirmarContrasenia) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (form.contrasenia.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const success = await register(form.nombre, form.contrasenia, form.cargo)
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Error al registrar usuario. El nombre de usuario puede estar en uso.')
      }
    } catch (err) {
      setError('Error al registrar usuario. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-coffee-200">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-coffee-600 p-3 rounded-full">
              <Coffee className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-coffee-800">
              Crear Cuenta
            </CardTitle>
            <p className="text-coffee-600 mt-2">
              Únete al sistema de Cafés Marloy
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-coffee-700 font-medium">
                Usuario
              </Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ingrese su nombre de usuario"
                value={form.nombre}
                onChange={handleChange}
                className="border-coffee-200 focus:border-coffee-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo" className="text-coffee-700 font-medium">
                Cargo
              </Label>
              <Select value={form.cargo} onValueChange={handleSelectChange}>
                <SelectTrigger className="border-coffee-200 focus:border-coffee-400">
                  <SelectValue placeholder="Seleccione su cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Empleado">Empleado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasenia" className="text-coffee-700 font-medium">
                Contraseña
              </Label>
              <Input
                id="contrasenia"
                name="contrasenia"
                type="password"
                placeholder="Ingrese su contraseña"
                value={form.contrasenia}
                onChange={handleChange}
                className="border-coffee-200 focus:border-coffee-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarContrasenia" className="text-coffee-700 font-medium">
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmarContrasenia"
                name="confirmarContrasenia"
                type="password"
                placeholder="Confirme su contraseña"
                value={form.confirmarContrasenia}
                onChange={handleChange}
                className="border-coffee-200 focus:border-coffee-400"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-coffee-600 hover:bg-coffee-700 text-white font-medium py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Cuenta
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-coffee-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="text-coffee-700 hover:text-coffee-800 font-medium underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
