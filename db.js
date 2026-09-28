import { MongoClient } from "mongodb"

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017"
const DB_NAME = "AH20232CP1"

const client = new MongoClient(MONGO_URI)

export const db = client.db(DB_NAME)

export async function connectDB() {
    await client.connect()
    console.log(`Conectado a MongoDB (${DB_NAME})`)
}

export async function closeDB() {
    await client.close()
}
