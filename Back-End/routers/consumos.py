from fastapi import APIRouter, Depends, HTTPException
from database.connection import get_connection
from models.consumo import Consumo, ConsumoCreate, ConsumoUpdate
from typing import List

router = APIRouter()

@router.get("/consumos", response_model=List[Consumo])
def get_consumos():
    """Obtener todos los consumos"""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id_consumo, fecha, id_maquina, cobro_mensual, id_insumo 
                FROM consumoInsumos 
                ORDER BY fecha DESC
            """)
            results = cursor.fetchall()
            return [
                Consumo(
                    id_consumo=row[0],
                    fecha=row[1],
                    id_maquina=row[2],
                    cobro_mensual=row[3],
                    id_insumo=row[4]
                )
                for row in results
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener consumos: {str(e)}")
    finally:
        connection.close()

@router.get("/consumos/{consumo_id}", response_model=Consumo)
def get_consumo(consumo_id: int):
    """Obtener un consumo por ID"""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id_consumo, fecha, id_maquina, cobro_mensual, id_insumo 
                FROM consumoInsumos 
                WHERE id_consumo = %s
            """, (consumo_id,))
            result = cursor.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Consumo no encontrado")
            
            return Consumo(
                id_consumo=result[0],
                fecha=result[1],
                id_maquina=result[2],
                cobro_mensual=result[3],
                id_insumo=result[4]
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener consumo: {str(e)}")
    finally:
        connection.close()

@router.post("/consumos", response_model=Consumo)
def create_consumo(consumo: ConsumoCreate):
    """Crear un nuevo consumo"""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO consumoInsumos (fecha, id_maquina, cobro_mensual, id_insumo)
                VALUES (%s, %s, %s, %s)
            """, (consumo.fecha, consumo.id_maquina, consumo.cobro_mensual, consumo.id_insumo))
            
            consumo_id = cursor.lastrowid
            connection.commit()
            
            return Consumo(
                id_consumo=consumo_id,
                fecha=consumo.fecha,
                id_maquina=consumo.id_maquina,
                cobro_mensual=consumo.cobro_mensual,
                id_insumo=consumo.id_insumo
            )
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear consumo: {str(e)}")
    finally:
        connection.close()

@router.put("/consumos/{consumo_id}", response_model=Consumo)
def update_consumo(consumo_id: int, consumo: ConsumoUpdate):
    """Actualizar un consumo"""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Verificar si el consumo existe
            cursor.execute("SELECT * FROM consumoInsumos WHERE id_consumo = %s", (consumo_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Consumo no encontrado")
            
            # Construir la consulta de actualización dinámicamente
            update_fields = []
            values = []
            
            if consumo.fecha is not None:
                update_fields.append("fecha = %s")
                values.append(consumo.fecha)
            if consumo.id_maquina is not None:
                update_fields.append("id_maquina = %s")
                values.append(consumo.id_maquina)
            if consumo.cobro_mensual is not None:
                update_fields.append("cobro_mensual = %s")
                values.append(consumo.cobro_mensual)
            if consumo.id_insumo is not None:
                update_fields.append("id_insumo = %s")
                values.append(consumo.id_insumo)
            
            if not update_fields:
                raise HTTPException(status_code=400, detail="No hay campos para actualizar")
            
            values.append(consumo_id)
            
            cursor.execute(f"""
                UPDATE consumoInsumos 
                SET {', '.join(update_fields)}
                WHERE id_consumo = %s
            """, values)
            
            connection.commit()
            
            # Obtener el consumo actualizado
            cursor.execute("""
                SELECT id_consumo, fecha, id_maquina, cobro_mensual, id_insumo 
                FROM consumoInsumos 
                WHERE id_consumo = %s
            """, (consumo_id,))
            result = cursor.fetchone()
            
            return Consumo(
                id_consumo=result[0],
                fecha=result[1],
                id_maquina=result[2],
                cobro_mensual=result[3],
                id_insumo=result[4]
            )
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar consumo: {str(e)}")
    finally:
        connection.close()

@router.delete("/consumos/{consumo_id}")
def delete_consumo(consumo_id: int):
    """Eliminar un consumo"""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM consumoInsumos WHERE id_consumo = %s", (consumo_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Consumo no encontrado")
            
            cursor.execute("DELETE FROM consumoInsumos WHERE id_consumo = %s", (consumo_id,))
            connection.commit()
            
            return {"message": "Consumo eliminado exitosamente"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar consumo: {str(e)}")
    finally:
        connection.close()

@router.get("/consumos/maquina/{maquina_id}", response_model=List[Consumo])
def get_consumos_by_maquina(maquina_id: int):
    """Obtener consumos por ID de máquina"""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id_consumo, fecha, id_maquina, cobro_mensual, id_insumo 
                FROM consumoInsumos 
                WHERE id_maquina = %s 
                ORDER BY fecha DESC
            """, (maquina_id,))
            results = cursor.fetchall()
            return [
                Consumo(
                    id_consumo=row[0],
                    fecha=row[1],
                    id_maquina=row[2],
                    cobro_mensual=row[3],
                    id_insumo=row[4]
                )
                for row in results
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener consumos por máquina: {str(e)}")
    finally:
        connection.close()
