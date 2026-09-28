import { Router } from "express"
import * as controller from "../controllers/products.api.controller.js"
import { validateBody, validateIdParam } from "../../middlewares/validate.middleware.js"
import { validateProduct } from "../../validations/products.validations.js"

const router = Router()

router.get("/productos", controller.getProducts)
router.get("/productos/:id", validateIdParam, controller.getProductById)
router.post("/productos", validateBody(validateProduct), controller.createProduct)
router.put("/productos/:id", validateIdParam, validateBody(validateProduct), controller.updateProduct)
router.patch("/productos/:id", validateIdParam, validateBody(validateProduct, { partial: true }), controller.updateProduct)
router.delete("/productos/:id", validateIdParam, controller.deleteProduct)

export default router
