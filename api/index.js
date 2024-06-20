import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import propertyRouter from "./routes/property.route.js"
import paymentRouter from "./routes/payment.route.js"
import cookieParser from 'cookie-parser';

import path from 'path'

dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected to MongoDB"));

const __dirname = path.resolve()

const app = express();
app.use(cookieParser());

app.use(express.json());
app.listen(3000, () => {
    console.log("Server listening on port 3000");
})

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/payment", paymentRouter);

app.use(express.static(path.join(__dirname, '/client/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
})