from fastapi import FastAPI
from routers import clientes

app = FastAPI()

# Prefijo para las rutas de la API dsp vemo si hacemo algo mejor aca pero por ahora para ver el ejemplo
app.include_router(clientes.router, prefix="/api/clientes")

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de cafes marloy. /api/ruta"}