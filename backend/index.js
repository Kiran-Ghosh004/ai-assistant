import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import geminiResponse from './gemini.js';


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

const port = process.env.PORT || 8000;

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.get("/", async (req, res) => {
    const prompt = req.query.prompt;
    const data = await geminiResponse(prompt);
    console.log(data);
    res.json(data);
});





app.listen(port, () => {
    connectDB();
    console.log(`🚀 Server running at: http://localhost:${port}`);
});


