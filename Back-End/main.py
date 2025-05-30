from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import clientes

app = FastAPI()

# 🔓 CORS sin restricciones para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # Aceptar cualquier origen
    allow_credentials=False,     # ⚠️ Tiene que ser False para que funcione con "*"
    allow_methods=["*"],         # Permitir todos los métodos (GET, POST, etc)
    allow_headers=["*"]          # Permitir todos los headers (incluidos los de Axios)
)

app.include_router(clientes.router, prefix="/api/clientes")

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Cafés Marloy. /api/ruta"}