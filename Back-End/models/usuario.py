from pydantic import BaseModel
from typing import Optional

# Base del usuario para login
class UsuarioLogin(BaseModel):
    nombre: str
    contrasenia: str

# Base del usuario para registro
class UsuarioRegister(BaseModel):
    nombre: str
    contrasenia: str
    cargo: str

# Base del usuario para actualizaciones
class UsuarioBase(BaseModel):
    nombre: str
    cargo: str

# Modelo del usuario con ID para respuestas (sin contraseña)
class Usuario(UsuarioBase):
    id_usuario: int

# Modelo completo del usuario (con contraseña, solo para uso interno)
class UsuarioCompleto(BaseModel):
    id_usuario: int
    nombre: str
    contrasenia: str
    cargo: str
