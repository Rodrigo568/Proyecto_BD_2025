from fastapi import APIRouter, HTTPException
from models.insumo import Insumo, InsumoBase
from database.connection import get_connection

router = APIRouter()

@router.get("/", response_model=list[Insumo])
def listar_insumos():
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_insumo, tipo, precio, id_proveedor FROM insumos")
        return cursor.fetchall()
    except Exception as e:
        print("❌ Error al obtener insumos:", e)
        return []
    finally:
        cursor.close()
        conn.close()

@router.post("/", response_model=Insumo)
def crear_insumo(insumo: InsumoBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar")
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO insumos (tipo, precio, id_proveedor) VALUES (%s, %s, %s)",
            (insumo.tipo, insumo.precio, insumo.id_proveedor)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        return Insumo(id_insumo=nuevo_id, **insumo.dict())
    except Exception as e:
        print("❌ Error al crear insumo:", e)
        raise HTTPException(status_code=500, detail="Error al crear insumo")
    finally:
        cursor.close()
        conn.close()


@router.put("/{id}", response_model=Insumo)
def actualizar_insumo(id: int, insumo: InsumoBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE insumos SET tipo=%s, precio=%s, id_proveedor=%s WHERE id_insumo=%s",
            (insumo.tipo, insumo.precio_unitario, insumo.id_proveedor, id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Insumo no encontrado")
        return Insumo(id_insumo=id, **insumo.dict())
    except Exception as e:
        print("❌ Error al actualizar insumo:", e)
        raise HTTPException(status_code=500, detail="Error al actualizar insumo")
    finally:
        cursor.close()
        conn.close()
