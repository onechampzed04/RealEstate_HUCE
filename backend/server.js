
import dotenv from 'dotenv';
dotenv.config();

console.log('[SERVER] Environment loaded. DEV_MODE:', process.env.DEV_MODE);

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import uploadRoutes from "./routes/upload.routes.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/listings", listingRoutes);

app.use("/api/users", authRoutes);

app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server running on port ${PORT}`)); 