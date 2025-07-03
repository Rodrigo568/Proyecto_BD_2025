from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ConsumoBase(BaseModel):
    fecha: datetime
    id_maquina: int
    cobro_mensual: float
    id_insumo: int

class ConsumoCreate(ConsumoBase):
    pass

class ConsumoUpdate(BaseModel):
    fecha: Optional[datetime] = None
    id_maquina: Optional[int] = None
    cobro_mensual: Optional[float] = None
    id_insumo: Optional[int] = None

class Consumo(ConsumoBase):
    id_consumo: int

    class Config:
        from_attributes = True
