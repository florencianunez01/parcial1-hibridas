import { cleanString, isUrl } from "./common.js"

export const BRAND_FIELDS = ["name", "photo", "description"]

/** Valida una marca y descarta los campos que no correspondan. */
export function validateBrand(body = {}) {
    const data = {}
    const errors = {}

    const name = cleanString(body.name)
    if (name.length < 2) errors.name = "El nombre debe tener al menos 2 caracteres"
    else data.name = name

    const photo = cleanString(body.photo)
    if (!isUrl(photo)) errors.photo = "La foto debe ser una URL válida (http/https)"
    else data.photo = photo

    const description = cleanString(body.description)
    if (description.length < 10) errors.description = "La descripción debe tener al menos 10 caracteres"
    else data.description = description

    return { data, errors }
}
