import { isObjectId } from "../validations/common.js"

/**
 * Middleware genérico de validación para la API.
 * Reemplaza req.body por los datos limpios (sólo campos permitidos).
 */
export function validateBody(validator, options = {}) {
    return (req, res, next) => {
        const { data, errors } = validator(req.body, options)
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ error: "Datos inválidos", details: errors })
        }
        req.body = data
        next()
    }
}

export function validateIdParam(req, res, next) {
    if (!isObjectId(req.params.id)) {
        return res.status(400).json({ error: "El ID no es válido" })
    }
    next()
}
