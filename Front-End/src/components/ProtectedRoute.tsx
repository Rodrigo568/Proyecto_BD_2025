import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
  restrictedForRoles?: string[] // Roles que NO pueden acceder a esta ruta
}

export default function ProtectedRoute({ children, adminOnly = false, restrictedForRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-coffee-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
          <p className="text-coffee-600 mt-4">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-coffee-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg border-coffee-200 border">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-coffee-800 mb-2">Acceso Denegado</h1>
          <p className="text-coffee-600">
            No tienes permisos para acceder a esta página. Solo los administradores pueden ver este contenido.
          </p>
        </div>
      </div>
    )
  }

  // Verificar si el rol del usuario está en la lista de roles restringidos
  if (user && restrictedForRoles.length > 0 && restrictedForRoles.includes(user.cargo.toLowerCase())) {
    return (
      <div className="min-h-screen bg-coffee-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg border-coffee-200 border">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-coffee-800 mb-2">Acceso Denegado</h1>
          <p className="text-coffee-600">
            No tienes permisos para acceder a esta página. Tu rol actual ({user.cargo}) no puede acceder a este contenido.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
