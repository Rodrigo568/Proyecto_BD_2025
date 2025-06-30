from fastapi import APIRouter, HTTPException
from models.tecnico import Tecnico, TecnicoBase
from database.connection import get_connection

router = APIRouter()

@router.get("/", response_model=list[Tecnico])
def listar_tecnicos():
    conn = get_connection()
    if conn is None:
        return []
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_tecnico, nombre, tipo_visita, id_cliente FROM tecnicos")
        return cursor.fetchall()
    except Exception as e:
        print("❌ Error al obtener técnicos:", e)
        return []
    finally:
        cursor.close()
        conn.close()

@router.post("/", response_model=Tecnico)
def crear_tecnico(tecnico: TecnicoBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar")
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO tecnicos (nombre, tipo_visita, id_cliente) VALUES (%s, %s, %s)",
            (tecnico.nombre, tecnico.tipo_visita, tecnico.id_cliente)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        return Tecnico(id_tecnico=nuevo_id, **tecnico.dict())
    except Exception as e:
        print("❌ Error al crear técnico:", e)
        raise HTTPException(status_code=500, detail="Error al crear técnico")
    finally:
        cursor.close()
        conn.close()

@router.put("/{id}", response_model=Tecnico)
def actualizar_tecnico(id: int, tecnico: TecnicoBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")
    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE tecnicos SET nombre=%s, tipo_visita=%s, id_cliente=%s WHERE id_tecnico=%s",
            (tecnico.nombre, tecnico.tipo_visita, tecnico.id_cliente, id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Técnico no encontrado")
        return Tecnico(id_tecnico=id, **tecnico.dict())
    except Exception as e:
        print("❌ Error al actualizar técnico:", e)
        raise HTTPException(status_code=500, detail="Error al actualizar técnico")
    finally:
        cursor.close()
        conn.close()