import express from "express";
import dotenv from "dotenv";
import { mongoConnection } from "./config/db.js";
import { router } from "./routes/userRouts.js";

const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use("/api",router)

app.get("/",(req,res)=>{
    res.send("testing")
})

app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})
