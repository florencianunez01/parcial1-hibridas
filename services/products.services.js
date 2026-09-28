import { ObjectId } from "mongodb"
import { db } from "../db.js"

const products = db.collection("Products")

/**
 * Arma el filtro de Mongo a partir de los parámetros permitidos.
 * Filtros soportados: category, ingredient, brand_id
 */
function buildFilter(filter = {}) {
    const query = {}

    if (filter.category) query.category = filter.category

    if (filter.ingredient) {
        // Busca el ingrediente dentro del array sin importar mayúsculas (ej: "niacinamida")
        const escaped = filter.ingredient.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        query.ingredients = { $regex: escaped, $options: "i" }
    }

    if (filter.brand_id && ObjectId.isValid(filter.brand_id)) {
        query.brand_id = new ObjectId(filter.brand_id)
    }

    return query
}

export async function getProducts(filter = {}) {
    return products.find(buildFilter(filter)).sort({ _id: -1 }).toArray()
}

export async function getProductById(id) {
    if (!ObjectId.isValid(id)) return null
    return products.findOne({ _id: new ObjectId(id) })
}

export async function getProductsByBrand(brandId) {
    if (!ObjectId.isValid(brandId)) return []
    return products.find({ brand_id: new ObjectId(brandId) }).sort({ _id: -1 }).toArray()
}

export async function createProduct(data) {
    const newProduct = { ...data, brand_id: new ObjectId(data.brand_id) }
    const result = await products.insertOne(newProduct)
    return { _id: result.insertedId, ...newProduct }
}

/** Actualiza los campos recibidos (todos en PUT, algunos en PATCH). */
export async function updateProduct(id, data) {
    if (!ObjectId.isValid(id)) return null

    const changes = { ...data }
    if (changes.brand_id) changes.brand_id = new ObjectId(changes.brand_id)

    return products.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: changes },
        { returnDocument: "after" }
    )
}

export async function deleteProduct(id) {
    if (!ObjectId.isValid(id)) return null
    return products.findOneAndDelete({ _id: new ObjectId(id) })
}
