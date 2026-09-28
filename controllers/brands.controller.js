import * as brandsService from "../services/brands.services.js"
import { getProductsByBrand } from "../services/products.services.js"
import { validateBrand } from "../validations/brands.validations.js"
import * as views from "../views/brands.views.js"
import { errorPage } from "../views/layout.js"

export async function list(req, res) {
    const brands = await brandsService.getBrands()
    res.send(views.brandsListView(brands))
}

export async function detail(req, res) {
    const brand = await brandsService.getBrandById(req.params.id)
    if (!brand) return res.status(404).send(errorPage("Marca no encontrada"))

    const products = await getProductsByBrand(req.params.id)
    res.send(views.brandDetailView(brand, products))
}

export function createForm(req, res) {
    res.send(views.brandFormView({}))
}

export async function create(req, res) {
    const { data, errors } = validateBrand(req.body)
    if (Object.keys(errors).length) {
        return res.status(400).send(views.brandFormView({ brand: req.body, errors }))
    }
    const brand = await brandsService.createBrand(data)
    res.redirect(`/marcas/${brand._id}`)
}
