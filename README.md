# Proyecto_BD_2025
**Proyecto de Base de Datos 1 - Primer Semestre 2025**

Este proyecto forma parte del curso de Base de Datos 1 del primer semestre del 2025. Incluye un backend desarrollado en Python para la gestión de una base de datos relacional y un frontend en ReactJS.

---

## Integrantes del Equipo

[![GitHub](https://img.shields.io/badge/GitHub-Rodrigo%20Doldan-blue.svg)](https://github.com/Rodrigo568)  
[![GitHub](https://img.shields.io/badge/GitHub-Valentín%20Curbelo-red.svg)](https://github.com/ValentinCurbelo)  
[![GitHub](https://img.shields.io/badge/GitHub-Agustín%20Negreira-green.svg)](https://github.com/BMorat)  
[![GitHub](https://img.shields.io/badge/GitHub-Brian%20Morat-black.svg)](https://github.com/Bmorat)

---

## 📦 Backend

El backend de este proyecto está construido con **Python** y utiliza **FastAPI** para exponer servicios web.

### 🔧 Requisitos

Antes de ejecutar el backend, asegúrate de tener **Python 3.13** instalado. Luego, instala las dependencias necesarias con:

```bash
pip install -r requirements.txt
```

### ⚙️ Configuración

Debes crear un archivo `.env` dentro del directorio `Back-End` con la siguiente información de conexión a tu base de datos:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=contraseña
DB_NAME=cafes_marloy_db
```

Modifica los valores según tu configuración local.

### 🚀 Ejecución

Para ejecutar el servidor del backend, navega al directorio del backend y corre el siguiente comando:

```bash
cd Back-End
uvicorn main:app --reload --port 5000
```

El servidor se iniciará en `http://localhost:5000`.

### 📡 Rutas de la API

Todas las rutas de la API estarán disponibles bajo el prefijo:

```
/api/ruta
```

Por ejemplo:  
`http://localhost:5000/api/clientes`

---

## 🧠 Nota

Asegúrate de tener corriendo tu servidor de base de datos y de que los datos del `.env` coincidan con tu configuración para evitar errores de conexión.
