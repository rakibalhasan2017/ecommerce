import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authroutes from './Routes/authroutes.js';
import productroutes from './Routes/productroutes.js';
import cartroutes from './Routes/cartroutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;
console.log(PORT);

app.use("/api/auth", authroutes);
app.use("/api/product", productroutes);
app.use("/api/cart", cartroutes);

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