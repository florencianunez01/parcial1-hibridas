import { createPage, esc } from "./layout.js"
import { getCategories, getCategoryBySlug } from "../services/categories.services.js"

const STEP_TEXT = {
    "limpiador": "Paso 1: limpiar la piel",
    "tonico": "Paso 2: equilibrar e hidratar",
    "serum": "Paso 3: tratar con activos",
    "hidratante": "Paso 4: sellar la hidratación",
    "protector-solar": "Paso 5: proteger (de día)"
}

export function homeView() {
    const cards = getCategories()
        .map(c => `
            <a class="section-card" href="/productos/categoria/${c.slug}">
                <img src="https://picsum.photos/seed/kbeauty-${c.slug}/400/300" alt="" loading="lazy">
                <span>${esc(c.name)}<small>${esc(STEP_TEXT[c.slug] || "")}</small></span>
            </a>`)
        .join("")

    return createPage("Inicio", `
        <section class="hero">
            <h1>Skin care coreano</h1>
            <p>Explorá los productos según el paso de tu rutina.</p>
            <a class="btn" href="/productos/nuevo">+ Nuevo producto</a>
        </section>
        <section class="sections-grid">${cards}</section>`)
}

function productCard(p, brandsById = {}) {
    const category = getCategoryBySlug(p.category)
    const brand = brandsById[String(p.brand_id)]
    const ingredients = (p.ingredients || []).map(i => `<li>${esc(i)}</li>`).join("")

    return `
    <article class="card">
        <img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">
        <div class="card-body">
            <span class="tag">${esc(category ? category.name : p.category)}</span>
            ${brand ? `<span class="brand-name">${esc(brand.name)}</span>` : ""}
            <h2>${esc(p.name)}</h2>
            <p>${esc(p.description)}</p>
            <ul class="techs">${ingredients}</ul>
            <div class="actions">
                <a href="${esc(p.link)}" target="_blank" rel="noopener">Ver en tienda ↗</a>
                <a href="/productos/${p._id}">Ver detalle</a>
            </div>
        </div>
    </article>`
}

export function productsListView(products, { title = "Todos los productos", active = "all", brands = [] } = {}) {
    const brandsById = Object.fromEntries(brands.map(b => [String(b._id), b]))
    const list = products.length
        ? `<section class="grid">${products.map(p => productCard(p, brandsById)).join("")}</section>`
        : `<p class="empty">Todavía no hay productos en esta categoría.</p>`

    return createPage(title, `
        <div class="page-head">
            <h1>${esc(title)}</h1>
            <a class="btn" href="/productos/nuevo">+ Nuevo producto</a>
        </div>
        ${list}`, { active })
}

export function productDetailView(p, brand) {
    const category = getCategoryBySlug(p.category)
    const ingredients = (p.ingredients || []).map(i => `<li>${esc(i)}</li>`).join("")

    return createPage(p.name, `
        <article class="detail">
            <img src="${esc(p.img)}" alt="${esc(p.name)}">
            <div>
                <span class="tag">${esc(category ? category.name : p.category)}</span>
                <h1>${esc(p.name)}</h1>
                <p><strong>Marca:</strong> ${brand ? `<a href="/marcas/${brand._id}">${esc(brand.name)}</a>` : "—"}</p>
                <p>${esc(p.description)}</p>
                <h3>Ingredientes destacados</h3>
                <ul class="techs">${ingredients}</ul>
                <p><a href="${esc(p.link)}" target="_blank" rel="noopener">Ver en tienda ↗</a></p>
                <div class="actions">
                    <a class="btn" href="/productos/${p._id}/editar">Editar</a>
                    <a class="btn btn-danger" href="/productos/${p._id}/eliminar">Eliminar</a>
                </div>
            </div>
        </article>`, { active: p.category })
}

function fieldError(errors, field) {
    return errors[field] ? `<small class="error">${esc(errors[field])}</small>` : ""
}

/** Formulario para alta y modificación. */
export function productFormView({ product = {}, brands = [], errors = {}, action, title }) {
    const ingredients = Array.isArray(product.ingredients) ? product.ingredients.join(", ") : product.ingredients || ""
    const brandId = product.brand_id ? String(product.brand_id) : ""

    const categoryOptions = getCategories()
        .map(c => `<option value="${c.slug}" ${c.slug === product.category ? "selected" : ""}>${esc(c.name)}</option>`)
        .join("")

    const brandOptions = brands
        .map(b => `<option value="${b._id}" ${String(b._id) === brandId ? "selected" : ""}>${esc(b.name)}</option>`)
        .join("")

    const noBrands = brands.length === 0
        ? `<p class="error">Primero tenés que <a href="/marcas/nuevo">crear una marca</a>: cada producto pertenece a una marca.</p>`
        : ""

    return createPage(title, `
        <h1>${esc(title)}</h1>
        ${noBrands}
        <form class="form" method="POST" action="${action}">
            <label>Nombre
                <input name="name" value="${esc(product.name || "")}" required minlength="3">
                ${fieldError(errors, "name")}
            </label>
            <label>Descripción
                <textarea name="description" rows="4" required minlength="10">${esc(product.description || "")}</textarea>
                ${fieldError(errors, "description")}
            </label>
            <label>Ingredientes destacados (separados por coma)
                <input name="ingredients" value="${esc(ingredients)}" placeholder="Niacinamida, Ácido hialurónico, Centella asiática" required>
                ${fieldError(errors, "ingredients")}
            </label>
            <label>Link a la tienda
                <input type="url" name="link" value="${esc(product.link || "")}" placeholder="https://..." required>
                ${fieldError(errors, "link")}
            </label>
            <label>Imagen (URL)
                <input type="url" name="img" value="${esc(product.img || "https://picsum.photos/400/300")}" required>
                ${fieldError(errors, "img")}
            </label>
            <label>Categoría
                <select name="category" required>
                    <option value="">Elegí una categoría</option>
                    ${categoryOptions}
                </select>
                ${fieldError(errors, "category")}
            </label>
            <label>Marca
                <select name="brand_id" required>
                    <option value="">Elegí una marca</option>
                    ${brandOptions}
                </select>
                ${fieldError(errors, "brand_id")}
            </label>
            <button class="btn" type="submit">Guardar</button>
        </form>`)
}

export function productDeleteView(p) {
    return createPage("Eliminar producto", `
        <section class="confirm">
            <h1>¿Eliminar "${esc(p.name)}"?</h1>
            <p>Esta acción no se puede deshacer.</p>
            <form method="POST" action="/productos/${p._id}/eliminar">
                <button class="btn btn-danger" type="submit">Sí, eliminar</button>
                <a class="btn btn-secondary" href="/productos/${p._id}">Cancelar</a>
            </form>
        </section>`)
}
