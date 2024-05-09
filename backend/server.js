import express from "express";
import api from './routes/index.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js";

dotenv.config()
mongoose.connect(process.env.MONGODB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the application if unable to connect to MongoDB
});


const PORT = process.env.PORT || 9000;
const origin = 'http://localhost:3000';

const app = express();

app.use(cors({
    origin
}));

// Add this middleware to parse JSON request bodies
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use(express.urlencoded({ extended: true }));

app.use(api);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(PORT, () => {
    console.log(`Your app is running on http://localhost:${PORT}`);
});
