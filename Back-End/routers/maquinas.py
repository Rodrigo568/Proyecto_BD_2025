from fastapi import APIRouter, HTTPException
from models.maquina import Maquina, MaquinaBase
from database.connection import get_connection

router = APIRouter()

# Get de todas las maquinas
@router.get("/", response_model=list[Maquina])
def listar_maquinas():
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_maquina, modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual FROM maquinas")
        resultados = cursor.fetchall()
        return resultados
    except Exception as e:
        print("❌ Error al obtener maquinas:", e)
        return []
    finally:
        cursor.close()
        conn.close()

# Get maquina por ID
@router.get("/{id}", response_model=Maquina)
def obtener_maquina(id: int):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id_maquina, modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual FROM maquinas WHERE id_maquina = %s",
            (id,)
        )
        resultado = cursor.fetchone()
        if resultado is None:
            raise HTTPException(status_code=404, detail="Maquina no encontrada")
        return resultado
    except Exception as e:
        print("❌ Error al obtener maquina:", e)
        raise HTTPException(status_code=500, detail="Error al obtener maquina")
    finally:
        cursor.close()
        conn.close()

# Get maquinas por cliente ID
@router.get("/cliente/{cliente_id}", response_model=list[Maquina])
def obtener_maquinas_por_cliente(cliente_id: int):
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id_maquina, modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual FROM maquinas WHERE id_cliente = %s",
            (cliente_id,)
        )
        resultados = cursor.fetchall()
        return resultados
    except Exception as e:
        print("❌ Error al obtener maquinas por cliente:", e)
        return []
    finally:
        cursor.close()
        conn.close()

# Crear una maquina
@router.post("/", response_model=Maquina)
def crear_maquina(maquina: MaquinaBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO maquinas (modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual) VALUES (%s, %s, %s, %s)",
            (maquina.modelo, maquina.id_cliente, maquina.ubicacion_cliente, maquina.costo_alquiler_mensual)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        return Maquina(
            id_maquina=nuevo_id,
            **maquina.dict()
        )
    except Exception as e:
        print("❌ Error al crear maquina:", e)
        raise HTTPException(status_code=500, detail="Error al crear maquina")
    finally:
        cursor.close()
        conn.close()

# Actualizar una maquina por ID
@router.put("/{id}", response_model=Maquina)
def actualizar_maquina(id: int, maquina: MaquinaBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE maquinas SET modelo=%s, id_cliente=%s, ubicacion_cliente=%s, costo_alquiler_mensual=%s WHERE id_maquina=%s",
            (maquina.modelo, maquina.id_cliente, maquina.ubicacion_cliente, maquina.costo_alquiler_mensual, id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Maquina no encontrada")
        return Maquina(id_maquina=id, **maquina.dict())
    except Exception as e:
        print("❌ Error al actualizar maquina:", e)
        raise HTTPException(status_code=500, detail="Error al actualizar maquina")
    finally:
        cursor.close()
        conn.close()

# Eliminar una maquina por ID
@router.delete("/{id}")
def eliminar_maquina(id: int):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM maquinas WHERE id_maquina = %s", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Maquina no encontrada")
        return {"message": "Maquina eliminada exitosamente"}
    except Exception as e:
        print("❌ Error al eliminar maquina:", e)
        raise HTTPException(status_code=500, detail="Error al eliminar maquina")
    finally:
        cursor.close()
        conn.close()
