import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import productsRouter from './routes/products';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.use(errorHandler);

export default app;
