
import dotenv from 'dotenv';
dotenv.config();

console.log('[SERVER] Environment loaded. DEV_MODE:', process.env.DEV_MODE);

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import propertyRoutes from './routes/propertyRoutes.js';
import userRoutes from './routes/userRoutes.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running");
});
