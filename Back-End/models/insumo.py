from pydantic import BaseModel

# Base del insumo
class InsumoBase(BaseModel):
    tipo: str
    precio: int
    id_proveedor: int

# Modelo completo con ID
class Insumo(InsumoBase):
    id_insumo: int
