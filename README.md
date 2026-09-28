# Seoul Glow: skin care coreano (Parcial 1, Aplicaciones Híbridas)

Catálogo de productos de skin care coreano organizados por paso de la rutina, con sus marcas. Tiene una API y páginas dinámicas hechas con **Express**, el **driver nativo de MongoDB** y **ECMAScript modules**. Corre en el puerto **3333**.

## Cómo ejecutarlo

```bash
npm install
npm run seed     # (opcional) carga 5 marcas y 11 productos de ejemplo
npm start        # http://localhost:3333
```

Por defecto se conecta a `mongodb://127.0.0.1:27017`. Para usar otra URI (por ejemplo, Atlas):
`MONGO_URI="mongodb+srv://..." npm start`

## Estructura (división de responsabilidades)

```
index.js                      → configura Express, monta las rutas y el manejo de errores
db.js                         → conexión a MongoDB (base AH20232CP1)
seed.js                       → datos de ejemplo
services/                     → acceso a datos (el único lugar que habla con MongoDB)
validations/                  → validación y limpieza de los campos que envía el cliente
middlewares/                  → validación reutilizable para la API
controllers/                  → lógica de las páginas web (usa services + views)
routes/                       → rutas web
views/                        → funciones que generan el HTML de cada página
api/controllers/              → lógica de la API (responde JSON)
api/routes/                   → rutas de la API
public/css/                   → estilos
```

## Modelado de la base de datos

Base: `AH20232CP1`. Colecciones: `Brands` (marcas) y `Products` (productos).

**Brands** (la entidad nueva de la Parte 3; cumple el rol de "Cliente")
```json
{
  "_id": ObjectId(),
  "name": "COSRX",
  "photo": "https://picsum.photos/300",
  "description": "Marca coreana conocida por fórmulas simples y efectivas."
}
```

**Products**
```json
{
  "_id": ObjectId(),
  "name": "Advanced Snail 96 Mucin Power Essence",
  "description": "Esencia liviana que hidrata y calma la piel.",
  "ingredients": ["Mucina de caracol", "Ácido hialurónico"],
  "link": "https://www.cosrx.com",
  "img": "https://picsum.photos/400/300",
  "category": "serum",
  "brand_id": ObjectId()
}
```

**Relación 1 a N por referencia:** cada producto guarda el `brand_id` de su marca, y ese campo es obligatorio al crear un producto. La marca no guarda un array de productos, así que puede tener cero, uno o muchos: se obtienen consultando `Products` por `brand_id`. Así no hace falta mantener dos colecciones sincronizadas cuando se crea, edita o elimina un producto.

### Categorías (menú)

| Categoría | Slug |
|---|---|
| Limpiadores | `limpiador` |
| Tónicos | `tonico` |
| Sérums y esencias | `serum` |
| Hidratantes | `hidratante` |
| Protectores solares | `protector-solar` |

## Páginas web (ABM de productos)

| Ruta | Descripción |
|---|---|
| `GET /` | Menú con las 5 categorías |
| `GET /productos` | Todos los productos |
| `GET /productos/categoria/:category` | Solo los productos de esa categoría |
| `GET /productos/:id` | Detalle del producto |
| `GET/POST /productos/nuevo` | Alta |
| `GET/POST /productos/:id/editar` | Modificación |
| `GET/POST /productos/:id/eliminar` | Baja (con confirmación) |
| `GET /marcas` · `GET /marcas/:id` · `GET/POST /marcas/nuevo` | Marcas y sus productos |

## API REST

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/productos` | Todos los productos. Filtros combinables: `?category=` e `?ingredient=` (también `?brand_id=`) |
| GET | `/api/productos/:id` | Un producto |
| POST | `/api/productos` | Crea un producto (requiere el `brand_id` de una marca existente) |
| PUT | `/api/productos/:id` | Reemplaza todos los campos |
| PATCH | `/api/productos/:id` | Modifica solo los campos enviados |
| DELETE | `/api/productos/:id` | Elimina un producto |

### Marcas

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/marcas` | Crea una marca |
| GET | `/api/marcas` | Todas las marcas |
| GET | `/api/marcas/:id` | Una marca |
| GET | `/api/marcas/:id/productos` | Productos de esa marca (`[]` si no tiene) |

### Validación

Solo se guardan los campos que el sistema necesita; cualquier otro campo enviado se descarta. Si falta un campo o es inválido, la API responde `400` con el detalle:

```json
{ "error": "Datos inválidos", "details": { "category": "La categoría no es válida" } }
```

Códigos que usa: `200` OK, `201` creado, `400` datos o ID inválidos, `404` no encontrado, `500` error del servidor.

### Ejemplos

```bash
# Filtrar por dos campos: sérums que contengan niacinamida
curl "http://localhost:3333/api/productos?category=serum&ingredient=niacinamida"

# Crear marca
curl -X POST http://localhost:3333/api/marcas -H "Content-Type: application/json" \
  -d '{"name":"Round Lab","photo":"https://picsum.photos/300","description":"Marca coreana de cuidado suave para la piel."}'

# Crear producto para esa marca
curl -X POST http://localhost:3333/api/productos -H "Content-Type: application/json" \
  -d '{"name":"1025 Dokdo Toner","description":"Tónico suave con agua de mar profunda.","ingredients":["Agua de mar","Pantenol"],"link":"https://example.com","img":"https://picsum.photos/400/300","category":"tonico","brand_id":"<ID_MARCA>"}'

# Modificar parcialmente
curl -X PATCH http://localhost:3333/api/productos/<ID> -H "Content-Type: application/json" -d '{"name":"Nuevo nombre"}'

# Eliminar
curl -X DELETE http://localhost:3333/api/productos/<ID>

# Productos de una marca
curl http://localhost:3333/api/marcas/<ID_MARCA>/productos
```
