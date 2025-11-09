import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

export const mongoConnection = mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Connected with DataBase"))
.catch((err)=>console.log(`Error while connecting with Data Base`))