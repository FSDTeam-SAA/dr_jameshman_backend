import mongoose from "mongoose";
import { databaseUri } from "./config.js";

export const connectDb = async()=>{
    try {
        await mongoose.connect(databaseUri)
        console.log('Database is connected...!')
    } catch (error) {
        console.log(error.message)
    }
}

