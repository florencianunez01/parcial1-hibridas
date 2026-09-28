import { ObjectId } from "mongodb"
import { db } from "../db.js"

const brands = db.collection("Brands")

export async function getBrands() {
    return brands.find().sort({ name: 1 }).toArray()
}

export async function getBrandById(id) {
    if (!ObjectId.isValid(id)) return null
    return brands.findOne({ _id: new ObjectId(id) })
}

export async function createBrand(data) {
    const newBrand = { ...data }
    const result = await brands.insertOne(newBrand)
    return { _id: result.insertedId, ...newBrand }
}

export async function brandExists(id) {
    if (!ObjectId.isValid(id)) return false
    const count = await brands.countDocuments({ _id: new ObjectId(id) }, { limit: 1 })
    return count > 0
}
