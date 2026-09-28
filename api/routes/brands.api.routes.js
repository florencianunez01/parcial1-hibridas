import { Router } from "express"
import * as controller from "../controllers/brands.api.controller.js"
import { validateBody, validateIdParam } from "../../middlewares/validate.middleware.js"
import { validateBrand } from "../../validations/brands.validations.js"

const router = Router()

router.get("/marcas", controller.getBrands)
router.post("/marcas", validateBody(validateBrand), controller.createBrand)
router.get("/marcas/:id", validateIdParam, controller.getBrandById)
router.get("/marcas/:id/productos", validateIdParam, controller.getBrandProducts)

export default router
