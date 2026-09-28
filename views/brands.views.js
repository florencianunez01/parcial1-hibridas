import { createPage, esc } from "./layout.js"
import { getCategoryBySlug } from "../services/categories.services.js"

export function brandsListView(brands) {
    const cards = brands
        .map(b => `
        <article class="card brand-card">
            <img src="${esc(b.photo)}" alt="Logo de ${esc(b.name)}" loading="lazy">
            <div class="card-body">
                <h2>${esc(b.name)}</h2>
                <p>${esc(b.description)}</p>
                <div class="actions"><a href="/marcas/${b._id}">Ver productos</a></div>
            </div>
        </article>`)
        .join("")

    return createPage("Marcas", `
        <div class="page-head">
            <h1>Marcas</h1>
            <a class="btn" href="/marcas/nuevo">+ Nueva marca</a>
        </div>
        ${brands.length ? `<section class="grid">${cards}</section>` : `<p class="empty">Todavía no hay marcas.</p>`}`,
    { active: "marcas" })
}

export function brandDetailView(brand, products) {
    const list = products.length
        ? `<ul class="list">${products.map(p => {
            const category = getCategoryBySlug(p.category)
            return `<li><a href="/productos/${p._id}">${esc(p.name)}</a> <span class="tag">${esc(category ? category.name : p.category)}</span></li>`
        }).join("")}</ul>`
        : `<p class="empty">Esta marca todavía no tiene productos cargados.</p>`

    return createPage(brand.name, `
        <article class="detail">
            <img src="${esc(brand.photo)}" alt="Logo de ${esc(brand.name)}">
            <div>
                <h1>${esc(brand.name)}</h1>
                <p>${esc(brand.description)}</p>
                <h3>Productos (${products.length})</h3>
                ${list}
            </div>
        </article>`, { active: "marcas" })
}

export function brandFormView({ brand = {}, errors = {} }) {
    const err = f => (errors[f] ? `<small class="error">${esc(errors[f])}</small>` : "")

    return createPage("Nueva marca", `
        <h1>Nueva marca</h1>
        <form class="form" method="POST" action="/marcas/nuevo">
            <label>Nombre
                <input name="name" value="${esc(brand.name || "")}" required minlength="2">
                ${err("name")}
            </label>
            <label>Foto / logo (URL)
                <input type="url" name="photo" value="${esc(brand.photo || "https://picsum.photos/300")}" required>
                ${err("photo")}
            </label>
            <label>Descripción
                <textarea name="description" rows="4" required minlength="10">${esc(brand.description || "")}</textarea>
                ${err("description")}
            </label>
            <button class="btn" type="submit">Guardar</button>
        </form>`, { active: "marcas" })
}
