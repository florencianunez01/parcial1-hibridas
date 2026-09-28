import { getCategories } from "../services/categories.services.js"

/** Escapa texto para insertarlo de forma segura en HTML. */
export function esc(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

function menu(active = "") {
    const items = getCategories()
        .map(c => `<li><a href="/productos/categoria/${c.slug}" class="${c.slug === active ? "active" : ""}">${esc(c.name)}</a></li>`)
        .join("")

    return `
    <header class="header">
        <a href="/" class="brand">Seoul Glow <span>K-Beauty</span></a>
        <nav>
            <ul class="menu">
                <li><a href="/productos" class="${active === "all" ? "active" : ""}">Todos</a></li>
                ${items}
                <li><a href="/marcas" class="${active === "marcas" ? "active" : ""}">Marcas</a></li>
            </ul>
        </nav>
    </header>`
}

export function createPage(title, content, { active = "" } = {}) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)} | Seoul Glow</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    ${menu(active)}
    <main class="container">
        ${content}
    </main>
    <footer class="footer">Seoul Glow · Skin care coreano — Parcial 1, Aplicaciones Híbridas</footer>
</body>
</html>`
}

export function errorPage(message, status = 404) {
    return createPage("Error", `
        <section class="empty">
            <h1>${status}</h1>
            <p>${esc(message)}</p>
            <a class="btn" href="/">Volver al inicio</a>
        </section>`)
}
