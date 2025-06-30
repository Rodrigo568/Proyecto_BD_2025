-- Borrar tablas si existen
DROP TABLE IF EXISTS mantenimientos;
DROP TABLE IF EXISTS tecnicos;
DROP TABLE IF EXISTS consumoInsumos;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS maquinas;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;

-- Crear tablas
CREATE TABLE clientes (
    id_cliente INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    direccion VARCHAR(100),
    telefono VARCHAR(30),
    correo VARCHAR(30)
);

CREATE TABLE maquinas (
    id_maquina INTEGER PRIMARY KEY AUTO_INCREMENT,
    modelo VARCHAR(50),
    id_cliente INTEGER,
    ubicacion_cliente VARCHAR(200),
    costo_alquiler_mensual INTEGER,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE proveedores (
    id_proveedor INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50)
);

CREATE TABLE insumos (
    id_insumo INTEGER PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50),
    precio INTEGER,
    id_proveedor INTEGER,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
);

CREATE TABLE consumoInsumos (
    id_consumo INTEGER PRIMARY KEY AUTO_INCREMENT,
    fecha DATETIME,
    id_maquina INTEGER,
    cobro_mensual FLOAT,
    id_insumo INTEGER,
    FOREIGN KEY (id_insumo) REFERENCES insumos(id_insumo),
    FOREIGN KEY (id_maquina) REFERENCES maquinas(id_maquina)
);

CREATE TABLE tecnicos (
    id_tecnico INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    tipo_visita VARCHAR(50),
    id_cliente INTEGER,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE mantenimientos (
    id_mantenimiento INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_maquina INTEGER,
    id_tecnico INTEGER,
    tipo VARCHAR(50),
    fecha DATETIME,
    observaciones VARCHAR(200),
    FOREIGN KEY (id_maquina) REFERENCES maquinas(id_maquina),
    FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico)
);

CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    contrasenia VARCHAR(200),
    cargo VARCHAR(50)
);

-- Crear usuario admin para cualquier host (usado por backend)
DROP USER IF EXISTS 'admin'@'%';
CREATE USER 'admin'@'%' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON MarloyCoffee.* TO 'admin'@'%';

-- Crear usuario admin para localhost (usado por DataGrip)
DROP USER IF EXISTS 'admin'@'localhost';
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON MarloyCoffee.* TO 'admin'@'localhost';

FLUSH PRIVILEGES;