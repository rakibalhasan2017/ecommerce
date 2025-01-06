import express from 'express';
import dotenv from 'dotenv';
import authroutes from './Routes/authroutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
console.log(PORT);


app.use("/api/auth", authroutes);

app.listen(PORT, () => {    
  console.log('Server is running on port', PORT); 
});     
