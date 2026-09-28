// Categorías del menú (nombre visible + slug que se guarda en cada producto)
const CATEGORIES = [
    { name: "Limpiadores", slug: "limpiador" },
    { name: "Tónicos", slug: "tonico" },
    { name: "Sérums y esencias", slug: "serum" },
    { name: "Hidratantes", slug: "hidratante" },
    { name: "Protectores solares", slug: "protector-solar" }
]

export function getCategories() {
    return CATEGORIES
}

export function getCategoryBySlug(slug) {
    return CATEGORIES.find(category => category.slug === slug) || null
}

export function isValidCategory(slug) {
    return CATEGORIES.some(category => category.slug === slug)
}
