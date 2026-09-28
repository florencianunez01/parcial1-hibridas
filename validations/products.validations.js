import { isValidCategory } from "../services/categories.services.js"
import { cleanString, isObjectId, isUrl, toStringArray } from "./common.js"

export const PRODUCT_FIELDS = ["name", "description", "ingredients", "link", "img", "category", "brand_id"]

const rules = {
    name: value => {
        const v = cleanString(value)
        if (v.length < 3) return { error: "El nombre debe tener al menos 3 caracteres" }
        return { value: v }
    },
    description: value => {
        const v = cleanString(value)
        if (v.length < 10) return { error: "La descripción debe tener al menos 10 caracteres" }
        return { value: v }
    },
    ingredients: value => {
        const v = toStringArray(value)
        if (v.length === 0) return { error: "Debe indicar al menos un ingrediente activo" }
        return { value: v }
    },
    link: value => {
        const v = cleanString(value)
        if (!isUrl(v)) return { error: "El link debe ser una URL válida (http/https)" }
        return { value: v }
    },
    img: value => {
        const v = cleanString(value)
        if (!isUrl(v)) return { error: "La imagen debe ser una URL válida (http/https)" }
        return { value: v }
    },
    category: value => {
        const v = cleanString(value)
        if (!isValidCategory(v)) return { error: "La categoría no es válida" }
        return { value: v }
    },
    brand_id: value => {
        const v = cleanString(value)
        if (!isObjectId(v)) return { error: "La marca es obligatoria y debe ser un ID válido" }
        return { value: v }
    }
}

/**
 * Valida un producto y descarta cualquier campo que no pertenezca al sistema.
 * partial = true -> sólo valida los campos presentes (PATCH).
 * Devuelve { data, errors } donde errors es un objeto { campo: mensaje }.
 */
export function validateProduct(body = {}, { partial = false } = {}) {
    const data = {}
    const errors = {}

    for (const field of PRODUCT_FIELDS) {
        const present = body[field] !== undefined
        if (partial && !present) continue

        const result = rules[field](body[field])
        if (result.error) errors[field] = result.error
        else data[field] = result.value
    }

    if (partial && Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
        errors.body = `Debe enviar al menos uno de estos campos: ${PRODUCT_FIELDS.join(", ")}`
    }

    return { data, errors }
}
