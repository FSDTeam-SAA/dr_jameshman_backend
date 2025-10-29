import dotenv from "dotenv"

dotenv.config()

export const serverPort = process.env.PORT || 8000
export const databaseUri = process.env.MONGODB_URI

