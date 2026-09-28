export const isObjectId = value => typeof value === "string" && /^[a-f\d]{24}$/i.test(value)

export function isUrl(value) {
    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}

export const cleanString = value => (typeof value === "string" ? value.trim() : "")

/** Acepta un array o un string separado por comas ("Vue, Node") y devuelve un array limpio. */
export function toStringArray(value) {
    const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : []
    return [...new Set(list.map(cleanString).filter(Boolean))]
}
