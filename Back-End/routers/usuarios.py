from fastapi import APIRouter, HTTPException
from models.usuario import Usuario, UsuarioBase, UsuarioLogin, UsuarioRegister, UsuarioCompleto
from database.connection import get_connection

router = APIRouter()

# Registro de usuario
@router.post("/register", response_model=Usuario)
def registrar_usuario(usuario: UsuarioRegister):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")
    
    try:
        cursor = conn.cursor()
        # Verificar si el usuario ya existe
        cursor.execute("SELECT id_usuario FROM usuarios WHERE nombre = %s", (usuario.nombre,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="El usuario ya existe")
        
        # Crear nuevo usuario
        cursor.execute(
            "INSERT INTO usuarios (nombre, contrasenia, cargo) VALUES (%s, %s, %s)",
            (usuario.nombre, usuario.contrasenia, usuario.cargo)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        
        return Usuario(
            id_usuario=nuevo_id,
            nombre=usuario.nombre,
            cargo=usuario.cargo
        )
    except HTTPException:
        raise
    except Exception as e:
        print("❌ Error al registrar usuario:", e)
        raise HTTPException(status_code=500, detail="Error al registrar usuario")
    finally:
        cursor.close()
        conn.close()

# Login de usuario
@router.post("/login", response_model=Usuario)
def login_usuario(credenciales: UsuarioLogin):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id_usuario, nombre, contrasenia, cargo FROM usuarios WHERE nombre = %s",
            (credenciales.nombre,)
        )
        usuario = cursor.fetchone()
        
        if not usuario:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        
        if usuario['contrasenia'] != credenciales.contrasenia:
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        
        return Usuario(
            id_usuario=usuario['id_usuario'],
            nombre=usuario['nombre'],
            cargo=usuario['cargo']
        )
    except HTTPException:
        raise
    except Exception as e:
        print("❌ Error al hacer login:", e)
        raise HTTPException(status_code=500, detail="Error al hacer login")
    finally:
        cursor.close()
        conn.close()

# Get de todos los usuarios
@router.get("/", response_model=list[Usuario])
def listar_usuarios():
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_usuario, nombre, cargo FROM usuarios")
        resultados = cursor.fetchall()
        return resultados
    except Exception as e:
        print("❌ Error al obtener usuarios:", e)
        return []
    finally:
        cursor.close()
        conn.close()

# Get usuario por ID
@router.get("/{id}", response_model=Usuario)
def obtener_usuario(id: int):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id_usuario, nombre, cargo FROM usuarios WHERE id_usuario = %s",
            (id,)
        )
        resultado = cursor.fetchone()
        if resultado is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return resultado
    except HTTPException:
        raise
    except Exception as e:
        print("❌ Error al obtener usuario:", e)
        raise HTTPException(status_code=500, detail="Error al obtener usuario")
    finally:
        cursor.close()
        conn.close()

# Actualizar usuario por ID
@router.put("/{id}", response_model=Usuario)
def actualizar_usuario(id: int, usuario: UsuarioBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE usuarios SET nombre=%s, cargo=%s WHERE id_usuario=%s",
            (usuario.nombre, usuario.cargo, id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return Usuario(id_usuario=id, **usuario.dict())
    except HTTPException:
        raise
    except Exception as e:
        print("❌ Error al actualizar usuario:", e)
        raise HTTPException(status_code=500, detail="Error al actualizar usuario")
    finally:
        cursor.close()
        conn.close()

# Eliminar usuario por ID
@router.delete("/{id}")
def eliminar_usuario(id: int):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id_usuario = %s", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return {"message": "Usuario eliminado exitosamente"}
    except Exception as e:
        print("❌ Error al eliminar usuario:", e)
        raise HTTPException(status_code=500, detail="Error al eliminar usuario")
    finally:
        cursor.close()
        conn.close()
