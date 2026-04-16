import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './modules/product/presentation/routes/productRoutes';
import { errorHandler } from './shared/middlewares/errorHandler';
import { connectDatabase } from './shared/config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Error handling
app.use(errorHandler);

const start = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;