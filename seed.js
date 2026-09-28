// Carga datos de ejemplo en la base AH20232CP1. Uso: npm run seed
import { db, connectDB, closeDB } from "./db.js"

const brandsData = [
    { name: "COSRX", photo: "https://picsum.photos/seed/cosrx/300", description: "Marca coreana conocida por fórmulas simples y efectivas, como su esencia de mucina de caracol." },
    { name: "Beauty of Joseon", photo: "https://picsum.photos/seed/joseon/300", description: "Marca inspirada en los rituales de belleza de la dinastía Joseon, con ingredientes como arroz y ginseng." },
    { name: "Laneige", photo: "https://picsum.photos/seed/laneige/300", description: "Marca especializada en hidratación, famosa por sus mascarillas de noche." },
    { name: "Innisfree", photo: "https://picsum.photos/seed/innisfree/300", description: "Marca que usa ingredientes de la isla de Jeju, como el té verde." },
    { name: "Anua", photo: "https://picsum.photos/seed/anua/300", description: "Marca recién agregada al catálogo, todavía sin productos cargados." }
]

await connectDB()

await db.collection("Products").deleteMany({})
await db.collection("Brands").deleteMany({})

const { insertedIds } = await db.collection("Brands").insertMany(brandsData)
const [cosrx, joseon, laneige, innisfree] = Object.values(insertedIds)

const img = seed => `https://picsum.photos/seed/${seed}/400/300`

// Los links apuntan al sitio de cada marca a modo de ejemplo
const products = [
    // Limpiadores
    { name: "Low pH Good Morning Gel Cleanser", description: "Limpiador en gel suave de pH bajo, pensado para usar a la mañana.", ingredients: ["BHA", "Árbol de té"], link: "https://www.cosrx.com", img: img("k1"), category: "limpiador", brand_id: cosrx },
    { name: "Green Tea Foam Cleanser", description: "Espuma limpiadora con extracto de té verde que limpia sin resecar.", ingredients: ["Té verde", "Aminoácidos"], link: "https://www.innisfree.com", img: img("k2"), category: "limpiador", brand_id: innisfree },
    // Tónicos
    { name: "AHA/BHA Clarifying Treatment Toner", description: "Tónico exfoliante suave que ayuda a mantener los poros limpios.", ingredients: ["AHA", "BHA", "Agua de manzana"], link: "https://www.cosrx.com", img: img("k3"), category: "tonico", brand_id: cosrx },
    { name: "Cream Skin Toner & Moisturizer", description: "Tónico cremoso que hidrata como una crema ligera.", ingredients: ["Té blanco", "Ceramidas"], link: "https://www.laneige.com", img: img("k4"), category: "tonico", brand_id: laneige },
    // Sérums y esencias
    { name: "Advanced Snail 96 Mucin Power Essence", description: "Esencia liviana con mucina de caracol que hidrata y calma la piel.", ingredients: ["Mucina de caracol", "Ácido hialurónico"], link: "https://www.cosrx.com", img: img("k5"), category: "serum", brand_id: cosrx },
    { name: "Glow Serum: Propolis + Niacinamide", description: "Sérum para dar luminosidad y unificar el tono de la piel.", ingredients: ["Propóleo", "Niacinamida"], link: "https://beautyofjoseon.com", img: img("k6"), category: "serum", brand_id: joseon },
    { name: "Green Tea Seed Serum", description: "Sérum hidratante con semillas de té verde de Jeju.", ingredients: ["Té verde", "Ácido hialurónico"], link: "https://www.innisfree.com", img: img("k7"), category: "serum", brand_id: innisfree },
    // Hidratantes
    { name: "Water Sleeping Mask", description: "Mascarilla de noche en gel que hidrata mientras dormís.", ingredients: ["Ácido hialurónico", "Escualano"], link: "https://www.laneige.com", img: img("k8"), category: "hidratante", brand_id: laneige },
    { name: "Dynasty Cream", description: "Crema nutritiva de textura rica, ideal para pieles secas.", ingredients: ["Agua de arroz", "Niacinamida", "Ginseng"], link: "https://beautyofjoseon.com", img: img("k9"), category: "hidratante", brand_id: joseon },
    // Protectores solares
    { name: "Relief Sun: Rice + Probiotics SPF50+", description: "Protector solar liviano de terminación natural, sin dejar marcas blancas.", ingredients: ["Extracto de arroz", "Probióticos"], link: "https://beautyofjoseon.com", img: img("k10"), category: "protector-solar", brand_id: joseon },
    { name: "Daily UV Defense Sunscreen", description: "Protector solar de uso diario con textura ligera.", ingredients: ["Té verde", "Centella asiática"], link: "https://www.innisfree.com", img: img("k11"), category: "protector-solar", brand_id: innisfree }
]

await db.collection("Products").insertMany(products)
await db.collection("Products").createIndex({ brand_id: 1 })
await db.collection("Products").createIndex({ category: 1 })

console.log(`Cargadas ${brandsData.length} marcas y ${products.length} productos`)
await closeDB()
