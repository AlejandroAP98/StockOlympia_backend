# 🗄️ StockOlympia Backend

**StockOlympia Backend** es un sistema de gestión de inventario multi-sede desarrollado con **Node.js** y **PostgreSQL**.  
Permite controlar movimientos de productos en tiempo real, integrar escaneo de códigos de barras y gestionar accesos según roles de usuario.

## 🎯 Propósito y Alcance
- **Gestión de productos**: creación, búsqueda e identificación por código de barras.
- **Registro de movimientos**: operaciones de *entrada* y *salida* de inventario.
- **Multi-ubicación**: control de inventario en múltiples salas o almacenes.
- **Seguridad**: autenticación con **JWT** y control de acceso por roles.
- **Operaciones en tiempo real**: actualización inmediata de stock con escaneo de códigos de barras.
- **Reportes**: análisis y consulta de historial de movimientos.

## 🏗 Arquitectura
- Patrón **MVC (Model-View-Controller)**.
- **Express.js** como framework web.
- **PostgreSQL** para persistencia de datos.
- **Pooling de conexiones** con la librería `pg`.
- API REST consumida por clientes web y móviles.
- Integridad referencial con *foreign keys* en PostgreSQL.

## 🔑 Áreas funcionales principales

### 📦 Operaciones de movimientos
Controladas por `movimientoController`:
| Operación | Método del Controller | Impacto en Base de Datos |
|-----------|-----------------------|--------------------------|
| **Entrada** | `registerEntryByBarcode` | Incrementa inventario en `salas_productos` |
| **Salida** | `registerExitByBarcode` | Disminuye inventario en `salas_productos` |

Ambas operaciones usan **escaneo de código de barras** y registran transacciones en la tabla `movimientos`.

### 🛍 Gestión de productos
Controlada por `productoController`:
- **Búsqueda**: por nombre o código de barras (`searchProducts`).
- **Integración con códigos de barra**: obtención directa de productos (`getProductByBarcode`).
- **Inventario agregado**: stock total por ubicación.
- **Última lectura**: recuperación del último código escaneado (`getLastScannedCode`).

## 🌐 Flujo típico de operación
1. **Autenticación** del usuario vía JWT.
2. **Búsqueda de producto** por código de barras.
3. **Actualización de inventario** según entrada o salida.
4. **Registro de movimiento** en la base de datos.
5. **Respuesta** en tiempo real al cliente.

## 🛠 Tecnologías utilizadas
| Componente       | Tecnología            | Propósito |
|------------------|-----------------------|-----------|
| Runtime          | Node.js               | Entorno de ejecución |
| Framework        | Express.js 4.21.1     | API REST |
| Base de datos    | PostgreSQL            | Almacenamiento de datos |
| Pool conexiones  | pg 8.13.1              | Gestión eficiente de conexiones |
| Autenticación    | jsonwebtoken 9.0.2     | Manejo de tokens JWT |
| Seguridad        | bcryptjs 2.4.3         | Hashing de contraseñas |
| CORS             | cors 2.8.5             | Control de peticiones cruzadas |

## 🔗 Integración
- API REST consumida por **StockOlympia Front** y clientes móviles.
- Seguridad basada en JWT para todas las operaciones.
- Relaciones entre **productos**, **salas**, **usuarios** y **movimientos** aseguradas con integridad referencial en PostgreSQL.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/AlejandroAP98/StockOlympia_backend)
