from pydantic import BaseModel

class TecnicoBase(BaseModel):
    nombre: str
    tipo_visita: str
    id_cliente: int

class Tecnico(TecnicoBase):
    id_tecnico: int

    