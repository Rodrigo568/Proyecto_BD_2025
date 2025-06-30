import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Coffee, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import logo from '@/assets/Marloy.png'
import bgCafe from '@/assets/cafeback.png'




export default function Login() {
  const [form, setForm] = useState({
    nombre: '',
    contrasenia: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!form.nombre || !form.contrasenia) {
      setError('Por favor complete todos los campos')
      setLoading(false)
      return
    }

    try {
      const success = await login(form.nombre, form.contrasenia)
      if (success) {
        navigate('/clientes')
      } else {
        setError('Credenciales incorrectas. Verifique su usuario y contraseña.')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }




return (
  <div
    className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
    style={{ backgroundImage: `url(${bgCafe})` }}
  >
    <Card className="w-full max-w-md bg-white shadow-xl border-coffee-200">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <img 
            src={logo} 
            alt="Logo de Cafés Marloy" 
            className="h-28 w-28 object-contain transition-transform duration-300 hover:scale-105" 
          />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-coffee-800">
            Iniciar Sesión
          </CardTitle>
          <p className="text-coffee-600 mt-2">
            Accede a tu cuenta de Cafés Marloy
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
              placeholder="Ingrese su usuario"
              value={form.nombre}
              onChange={handleChange}
              className="border-coffee-200 focus:border-coffee-400"
              required
            />
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

          <Button 
            type="submit" 
            className="w-full bg-coffee-600 hover:bg-coffee-700 text-white font-medium py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-coffee-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/register" 
              className="text-coffee-700 hover:text-coffee-800 font-medium underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
)
}
