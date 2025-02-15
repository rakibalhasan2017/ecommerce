import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from "cors";
import authroutes from './Routes/authroutes.js';
import productroutes from './Routes/productroutes.js';
import cartroutes from './Routes/cartroutes.js';
import couponroutes from './Routes/couponroutes.js';


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;
console.log(PORT);

app.use("/api/auth", authroutes);
app.use("/api/product", productroutes);
app.use("/api/cart", cartroutes);
app.use("/api/coupon", couponroutes);

mongoose.connect(MONGODB_URL)
.then(() => {
    app.listen(PORT, () => {
        console.log(`server is running to ${PORT}`);
    })
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});