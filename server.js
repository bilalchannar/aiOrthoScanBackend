import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import routes from "./Routes/route.js"
import { dbConnect } from "./config/db.js"
import cors from "cors"
import mongoSanitize from 'express-mongo-sanitize'
import helmet from "helmet"
import { errorHandler } from "./middlewares/errorHandler.js"
dotenv.config()

const PORT=process.env.PORT||5000;
const app=express();

dbConnect();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Data sanitization middleware
app.use(mongoSanitize());

app.use("/api",routes);

// Global error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT||5000,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});

