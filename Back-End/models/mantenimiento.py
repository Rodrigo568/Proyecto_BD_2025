from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Base del mantenimiento
class MantenimientoBase(BaseModel):
    id_maquina: int
    id_tecnico: int
    tipo: str
    fecha: datetime
    observaciones: Optional[str] = None

# Modelo del mantenimiento con ID para respuestas
class Mantenimiento(MantenimientoBase):
    id_mantenimiento: int
