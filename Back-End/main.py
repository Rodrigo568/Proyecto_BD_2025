from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import clientes, proveedores, insumos, maquinas, tecnicos, usuarios

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
app.include_router(proveedores.router, prefix="/api/proveedores")
app.include_router(insumos.router, prefix="/api/insumos")
app.include_router(maquinas.router, prefix="/api/maquinas")
app.include_router(tecnicos.router, prefix="/api/tecnicos")
app.include_router(usuarios.router, prefix="/api/usuarios")


@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Cafés Marloy. /api/ruta"}