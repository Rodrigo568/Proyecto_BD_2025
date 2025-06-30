from fastapi import APIRouter, HTTPException
from models.mantenimiento import Mantenimiento, MantenimientoBase
from database.connection import get_connection
from datetime import datetime

router = APIRouter()

# Get de todos los mantenimientos
@router.get("/", response_model=list[Mantenimiento])
def listar_mantenimientos():
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id_mantenimiento, id_maquina, id_tecnico, tipo, fecha, observaciones 
            FROM mantenimientos 
            ORDER BY fecha DESC
        """)
        resultados = cursor.fetchall()
        return resultados
    except Exception as e:
        print("❌ Error al obtener mantenimientos:", e)
        return []
    finally:
        cursor.close()
        conn.close()

# Get mantenimiento por ID
@router.get("/{id}", response_model=Mantenimiento)
def obtener_mantenimiento(id: int):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id_mantenimiento, id_maquina, id_tecnico, tipo, fecha, observaciones 
            FROM mantenimientos 
            WHERE id_mantenimiento = %s
        """, (id,))
        resultado = cursor.fetchone()
        if resultado is None:
            raise HTTPException(status_code=404, detail="Mantenimiento no encontrado")
        return resultado
    except HTTPException:
        raise
    except Exception as e:
        print("❌ Error al obtener mantenimiento:", e)
        raise HTTPException(status_code=500, detail="Error al obtener mantenimiento")
    finally:
        cursor.close()
        conn.close()

# Get mantenimientos por máquina ID
@router.get("/maquina/{maquina_id}", response_model=list[Mantenimiento])
def obtener_mantenimientos_por_maquina(maquina_id: int):
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id_mantenimiento, id_maquina, id_tecnico, tipo, fecha, observaciones 
            FROM mantenimientos 
            WHERE id_maquina = %s 
            ORDER BY fecha DESC
        """, (maquina_id,))
        resultados = cursor.fetchall()
        return resultados
    except Exception as e:
        print("❌ Error al obtener mantenimientos por máquina:", e)
        return []
    finally:
        cursor.close()
        conn.close()

# Get mantenimientos por técnico ID
@router.get("/tecnico/{tecnico_id}", response_model=list[Mantenimiento])
def obtener_mantenimientos_por_tecnico(tecnico_id: int):
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id_mantenimiento, id_maquina, id_tecnico, tipo, fecha, observaciones 
            FROM mantenimientos 
            WHERE id_tecnico = %s 
            ORDER BY fecha DESC
        """, (tecnico_id,))
        resultados = cursor.fetchall()
        return resultados
    except Exception as e:
        print("❌ Error al obtener mantenimientos por técnico:", e)
        return []
    finally:
        cursor.close()
        conn.close()

# Crear un mantenimiento
@router.post("/", response_model=Mantenimiento)
def crear_mantenimiento(mantenimiento: MantenimientoBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO mantenimientos (id_maquina, id_tecnico, tipo, fecha, observaciones) 
            VALUES (%s, %s, %s, %s, %s)
        """, (
            mantenimiento.id_maquina,
            mantenimiento.id_tecnico,
            mantenimiento.tipo,
            mantenimiento.fecha,
            mantenimiento.observaciones
        ))
        conn.commit()
        nuevo_id = cursor.lastrowid
        
        return Mantenimiento(
            id_mantenimiento=nuevo_id,
            **mantenimiento.dict()
        )
    except Exception as e:
        print("❌ Error al crear mantenimiento:", e)
        raise HTTPException(status_code=500, detail="Error al crear mantenimiento")
    finally:
        cursor.close()
        conn.close()

# Actualizar un mantenimiento por ID
@router.put("/{id}", response_model=Mantenimiento)
def actualizar_mantenimiento(id: int, mantenimiento: MantenimientoBase):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE mantenimientos 
            SET id_maquina=%s, id_tecnico=%s, tipo=%s, fecha=%s, observaciones=%s 
            WHERE id_mantenimiento=%s
        """, (
            mantenimiento.id_maquina,
            mantenimiento.id_tecnico,
            mantenimiento.tipo,
            mantenimiento.fecha,
            mantenimiento.observaciones,
            id
        ))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Mantenimiento no encontrado")
        
        return Mantenimiento(id_mantenimiento=id, **mantenimiento.dict())
    except HTTPException:
        raise
    except Exception as e:
        print("❌ Error al actualizar mantenimiento:", e)
        raise HTTPException(status_code=500, detail="Error al actualizar mantenimiento")
    finally:
        cursor.close()
        conn.close()

# Eliminar un mantenimiento por ID
@router.delete("/{id}")
def eliminar_mantenimiento(id: int):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="No se pudo conectar a la base de datos")

    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM mantenimientos WHERE id_mantenimiento = %s", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Mantenimiento no encontrado")
        return {"message": "Mantenimiento eliminado exitosamente"}
    except Exception as e:
        print("❌ Error al eliminar mantenimiento:", e)
        raise HTTPException(status_code=500, detail="Error al eliminar mantenimiento")
    finally:
        cursor.close()
        conn.close()
