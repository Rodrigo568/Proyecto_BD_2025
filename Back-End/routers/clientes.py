from fastapi import APIRouter
from models.cliente import Cliente
from database.connection import get_connection

router = APIRouter()

@router.get("/", response_model=list[Cliente])
def listar_clientes():
    conn = get_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nombre, direccion, telefono, correo FROM clientes")
        resultados = cursor.fetchall()
        return resultados
    except Exception as e:
        print("❌ Error al obtener clientes:", e)
        return []
    finally:
        cursor.close()
        conn.close()