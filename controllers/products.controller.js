import * as productsService from "../services/products.services.js"
import { getBrands, getBrandById, brandExists } from "../services/brands.services.js"
import { getCategoryBySlug } from "../services/categories.services.js"
import { validateProduct } from "../validations/products.validations.js"
import * as views from "../views/products.views.js"
import { errorPage } from "../views/layout.js"

export function home(req, res) {
    res.send(views.homeView())
}

export async function list(req, res) {
    const [products, brands] = await Promise.all([productsService.getProducts(), getBrands()])
    res.send(views.productsListView(products, { brands }))
}

export async function listByCategory(req, res) {
    const category = getCategoryBySlug(req.params.category)
    if (!category) return res.status(404).send(errorPage("La categoría no existe"))

    const [products, brands] = await Promise.all([
        productsService.getProducts({ category: category.slug }),
        getBrands()
    ])
    res.send(views.productsListView(products, { title: category.name, active: category.slug, brands }))
}

export async function detail(req, res) {
    const product = await productsService.getProductById(req.params.id)
    if (!product) return res.status(404).send(errorPage("Producto no encontrado"))

    const brand = await getBrandById(String(product.brand_id))
    res.send(views.productDetailView(product, brand))
}

/** Valida el formulario y además verifica que la marca exista. */
async function validateForm(body) {
    const { data, errors } = validateProduct(body)
    if (!errors.brand_id && !(await brandExists(data.brand_id))) {
        errors.brand_id = "La marca no existe"
    }
    return { data, errors }
}

// ---------- Alta ----------
export async function createForm(req, res) {
    const brands = await getBrands()
    res.send(views.productFormView({ brands, action: "/productos/nuevo", title: "Nuevo producto" }))
}

export async function create(req, res) {
    const { data, errors } = await validateForm(req.body)

    if (Object.keys(errors).length) {
        const brands = await getBrands()
        return res.status(400).send(views.productFormView({
            product: req.body, brands, errors, action: "/productos/nuevo", title: "Nuevo producto"
        }))
    }

    const product = await productsService.createProduct(data)
    res.redirect(`/productos/${product._id}`)
}

// ---------- Modificación ----------
export async function editForm(req, res) {
    const product = await productsService.getProductById(req.params.id)
    if (!product) return res.status(404).send(errorPage("Producto no encontrado"))

    const brands = await getBrands()
    res.send(views.productFormView({
        product, brands, action: `/productos/${product._id}/editar`, title: `Editar: ${product.name}`
    }))
}

export async function edit(req, res) {
    const { id } = req.params
    const { data, errors } = await validateForm(req.body)

    if (Object.keys(errors).length) {
        const brands = await getBrands()
        return res.status(400).send(views.productFormView({
            product: req.body, brands, errors, action: `/productos/${id}/editar`, title: "Editar producto"
        }))
    }

    const product = await productsService.updateProduct(id, data)
    if (!product) return res.status(404).send(errorPage("Producto no encontrado"))
    res.redirect(`/productos/${product._id}`)
}

// ---------- Baja ----------
export async function deleteForm(req, res) {
    const product = await productsService.getProductById(req.params.id)
    if (!product) return res.status(404).send(errorPage("Producto no encontrado"))
    res.send(views.productDeleteView(product))
}

export async function remove(req, res) {
    const product = await productsService.deleteProduct(req.params.id)
    if (!product) return res.status(404).send(errorPage("Producto no encontrado"))
    res.redirect(`/productos/categoria/${product.category}`)
}
