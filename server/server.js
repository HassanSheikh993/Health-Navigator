import express from "express";
import dotenv from "dotenv";
import { mongoConnection } from "./config/db.js";
import { router } from "./routes/userRouts.js";
import { doctorRouter } from "./routes/doctorRouts.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"
import cookieParser from "cookie-parser";
import { reportRouter } from "./routes/reportRouts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())



app.use('/uploadProfileImages', express.static(path.join(__dirname, 'public', 'uploadProfileImages')));
app.use('/medicalReports', express.static(path.join(__dirname, 'public', 'medicalReports')));

app.use("/api",router)
app.use("/api",doctorRouter);
app.use("/api",reportRouter);

app.get("/",(req,res)=>{
    res.send("testing")
})

app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})
