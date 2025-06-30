from pydantic import BaseModel
from typing import Optional

# base de la maquina
class MaquinaBase(BaseModel):
    modelo: str
    id_cliente: int
    ubicacion_cliente: str
    costo_alquiler_mensual: int

# modelo de la maquina con ID para get
class Maquina(MaquinaBase):
    id_maquina: int
