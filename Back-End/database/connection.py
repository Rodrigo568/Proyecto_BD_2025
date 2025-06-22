import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

load_dotenv()  # Carga las variables desde .env asi que creenlo jaj

def get_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT")),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASS"),
            database=os.getenv("DB_NAME")
        )
        print("Conectando con:", os.getenv("DB_HOST"), os.getenv("DB_PORT"), os.getenv("DB_USER"), os.getenv("DB_PASS"))

        return connection
    except Error as e:
        print("Error al conectar a MySQL:", e)
        return None