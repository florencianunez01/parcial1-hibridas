import * as brandsService from "../../services/brands.services.js"
import { getProductsByBrand } from "../../services/products.services.js"

// GET /api/marcas
export async function getBrands(req, res) {
    try {
        const brands = await brandsService.getBrands()
        res.status(200).json(brands)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/marcas/:id
export async function getBrandById(req, res) {
    try {
        const brand = await brandsService.getBrandById(req.params.id)
        if (!brand) return res.status(404).json({ error: "Marca no encontrada" })
        res.status(200).json(brand)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// POST /api/marcas
export async function createBrand(req, res) {
    try {
        const brand = await brandsService.createBrand(req.body)
        res.status(201).json(brand)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/marcas/:id/productos
export async function getBrandProducts(req, res) {
    try {
        const brand = await brandsService.getBrandById(req.params.id)
        if (!brand) return res.status(404).json({ error: "Marca no encontrada" })

        const products = await getProductsByBrand(req.params.id)
        res.status(200).json(products) // puede ser [] si la marca todavía no tiene productos
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
