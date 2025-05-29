from pydantic import BaseModel

class Cliente(BaseModel):
    id: int
    nombre: str
    direccion: str
    telefono: str
    correo: str