import { Router } from "express"
import * as controller from "../controllers/brands.controller.js"

const router = Router()

router.get("/marcas", controller.list)
router.get("/marcas/nuevo", controller.createForm)
router.post("/marcas/nuevo", controller.create)
router.get("/marcas/:id", controller.detail)

export default router
