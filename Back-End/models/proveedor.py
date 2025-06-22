from pydantic import BaseModel

# base del proveedor
class ProveedorBase(BaseModel):
    nombre: str

# modelo del proveedor con ID para get
class Proveedor(ProveedorBase):
    id_proveedor: int