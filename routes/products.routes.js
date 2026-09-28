import { Router } from "express"
import * as controller from "../controllers/products.controller.js"

const router = Router()

router.get("/", controller.home)

router.get("/productos", controller.list)
router.get("/productos/categoria/:category", controller.listByCategory)

// Alta
router.get("/productos/nuevo", controller.createForm)
router.post("/productos/nuevo", controller.create)

// Detalle
router.get("/productos/:id", controller.detail)

// Modificación
router.get("/productos/:id/editar", controller.editForm)
router.post("/productos/:id/editar", controller.edit)

// Baja
router.get("/productos/:id/eliminar", controller.deleteForm)
router.post("/productos/:id/eliminar", controller.remove)

export default router
