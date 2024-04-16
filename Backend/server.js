import app from "./app.js"
import connectToDb from "./config/db.js";
import cloudinary from "cloudinary";
import Razorpay from 'razorpay';
import express from 'express'

import cors from 'cors';
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5014;

// cloudinary configuration
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

// razorpay configuration
export const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET,
})

app.listen(port,async()=>{
    await connectToDb()
    console.log(`port is up at ${port}`);
});

