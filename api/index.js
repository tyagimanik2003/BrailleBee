import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import multer from 'multer';
import spawn from 'child_process';
dotenv.config(); 
const app = express();
const upload = multer();

mongoose
    .connect('mongodb://0.0.0.0:27017/dell-hackathon-db')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });
app.use(express.json());
app.use('/api/user', userRoutes);   
app.use('/api/auth', authRoutes);   
app.use(cookieParser());
app.use(fileUpload());
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000!");
})  