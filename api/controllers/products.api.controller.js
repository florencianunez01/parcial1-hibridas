import * as productsService from "../../services/products.services.js"
import { brandExists } from "../../services/brands.services.js"
import { isValidCategory } from "../../services/categories.services.js"
import { isObjectId } from "../../validations/common.js"

// GET /api/productos?category=serum&ingredient=niacinamida&brand_id=...
export async function getProducts(req, res) {
    try {
        const { category, ingredient, brand_id } = req.query

        if (category && !isValidCategory(category)) {
            return res.status(400).json({ error: `La categoría "${category}" no existe` })
        }
        if (brand_id && !isObjectId(brand_id)) {
            return res.status(400).json({ error: "El brand_id no es válido" })
        }

        const products = await productsService.getProducts({ category, ingredient, brand_id })
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/productos/:id
export async function getProductById(req, res) {
    try {
        const product = await productsService.getProductById(req.params.id)
        if (!product) return res.status(404).json({ error: "Producto no encontrado" })
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// POST /api/productos
export async function createProduct(req, res) {
    try {
        if (!(await brandExists(req.body.brand_id))) {
            return res.status(404).json({ error: "La marca indicada no existe" })
        }
        const product = await productsService.createProduct(req.body)
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// PUT /api/productos/:id (reemplazo completo) y PATCH /api/productos/:id (parcial)
export async function updateProduct(req, res) {
    try {
        if (req.body.brand_id && !(await brandExists(req.body.brand_id))) {
            return res.status(404).json({ error: "La marca indicada no existe" })
        }
        const product = await productsService.updateProduct(req.params.id, req.body)
        if (!product) return res.status(404).json({ error: "Producto no encontrado" })
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE /api/productos/:id
export async function deleteProduct(req, res) {
    try {
        const product = await productsService.deleteProduct(req.params.id)
        if (!product) return res.status(404).json({ error: "Producto no encontrado" })
        res.status(200).json({ message: "Producto eliminado", product })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
