from fastapi import APIRouter
from models.proveedor import Proveedor, ProveedorBase
from database.connection import get_connection
from fastapi import HTTPException

router = APIRouter()

# Get de todos los cientes
@router.get("/", response_model=list[Proveedor])
def listar_clientes():
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_proveedor, nombre FROM proveedores")
        resultados = cursor.fetchall()
        return resultados
    except Exception as e:
        print("❌ Error al obtener proveedor:", e)
        return []
    finally:
        cursor.close()
        conn.close()

# Crear un cliente
@router.post("/", response_model=Proveedor)
def crear_proveedor(proveedor: ProveedorBase):
    conn = get_connection()
    if conn is None:
        return None
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO proveedores (nombre) VALUES (%s)",
            (proveedor.nombre,)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        return Proveedor(
            id_proveedor=nuevo_id,
            **proveedor.dict()
        )
    except Exception as e:
        print("❌ Error al crear proveedor:", e)
        return None
    finally:
        cursor.close()
        conn.close()

# updatear un cliente por ID
@router.put("/{id}", response_model=Proveedor)
def actualizar_proveedor(id: int, proveedor: ProveedorBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE proveedores SET nombre=%s WHERE id_proveedor=%s",
            (proveedor.nombre, id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        return Proveedor(id_proveedor=id, **proveedor.dict())
    except Exception as e:
        print("❌ Error al actualizar proveedor:", e)
        raise HTTPException(status_code=500, detail="Error al actualizar proveedor")
    finally:
        cursor.close()
        conn.close()