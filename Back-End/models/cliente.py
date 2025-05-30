from pydantic import BaseModel

# base del cliente
class ClienteBase(BaseModel):
    nombre: str
    direccion: str
    telefono: str
    correo: str

# modelo del cliente con ID para get
class Cliente(ClienteBase):
    id: int