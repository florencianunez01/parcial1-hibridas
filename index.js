import express from "express"
import { connectDB } from "./db.js"

import productsRoutes from "./routes/products.routes.js"
import brandsRoutes from "./routes/brands.routes.js"
import productsApiRoutes from "./api/routes/products.api.routes.js"
import brandsApiRoutes from "./api/routes/brands.api.routes.js"
import { errorPage } from "./views/layout.js"

const PORT = 3333
const app = express()

app.use(express.urlencoded({ extended: true })) // formularios HTML
app.use(express.json())                          // API (JSON)
app.use(express.static("public"))

// API REST
app.use("/api", productsApiRoutes)
app.use("/api", brandsApiRoutes)
app.use("/api", (req, res) => res.status(404).json({ error: "Endpoint no encontrado" }))

// Páginas dinámicas
app.use(productsRoutes)
app.use(brandsRoutes)

// 404 web
app.use((req, res) => res.status(404).send(errorPage("Página no encontrada")))

// Manejo de errores (JSON mal formado, errores de base de datos, etc.)
app.use((err, req, res, next) => {
    console.error(err)
    const status = err.status || 500
    if (req.originalUrl.startsWith("/api")) {
        return res.status(status).json({ error: status === 400 ? "JSON inválido" : "Error interno del servidor" })
    }
    res.status(status).send(errorPage("Ocurrió un error inesperado", status))
})

connectDB()
    .then(() => app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`)))
    .catch(err => {
        console.error("No se pudo conectar a MongoDB:", err.message)
        process.exit(1)
    })
