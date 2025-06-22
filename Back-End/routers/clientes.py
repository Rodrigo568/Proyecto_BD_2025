from fastapi import APIRouter
from models.cliente import Cliente, ClienteBase
from database.connection import get_connection
from fastapi import HTTPException

router = APIRouter()

# Get de todos los cientes
@router.get("/", response_model=list[Cliente])
def listar_clientes():
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_Cliente AS id, nombre, direccion, telefono, correo FROM clientes")
        resultados = cursor.fetchall()
        return resultados
    except Exception as e:
        print("❌ Error al obtener clientes:", e)
        return []
    finally:
        cursor.close()
        conn.close()

# Crear un cliente
@router.post("/", response_model=Cliente)
def crear_cliente(cliente: ClienteBase):
    conn = get_connection()
    if conn is None:
        return None

    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO clientes (nombre, direccion, telefono, correo) VALUES (%s, %s, %s, %s)",
            (cliente.nombre, cliente.direccion, cliente.telefono, cliente.correo)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        return Cliente(
            id=nuevo_id,
            **cliente.dict()
        )
    except Exception as e:
        print("❌ Error al crear cliente:", e)
        return None
    finally:
        cursor.close()
        conn.close()

# updatear un cliente por ID
@router.put("/{id}", response_model=Cliente)
def actualizar_cliente(id: int, cliente: ClienteBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE clientes SET nombre=%s, direccion=%s, telefono=%s, correo=%s WHERE id=%s",
            (cliente.nombre, cliente.direccion, cliente.telefono, cliente.correo, id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        return Cliente(id=id, **cliente.dict())
    except Exception as e:
        print("❌ Error al actualizar cliente:", e)
        raise HTTPException(status_code=500, detail="Error al actualizar cliente")
    finally:
        cursor.close()
        conn.close()