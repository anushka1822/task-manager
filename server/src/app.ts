// server/src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
const app: Application = express();

// --- Middlewares ---
// 1. CORS: Allow requests from your Frontend
app.use((req, res, next) => {
  console.log('Incoming Request:', req.method, req.path, 'Origin:', req.headers.origin);
  next();
});
app.use(cors({
  origin: true, // Allow any origin in development
  credentials: true,
}));

// 2. Body Parsers
app.use(express.json());
app.use(cookieParser());

// --- Test Route ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
// --- Global Error Handler (Required by PDF for consistent responses) ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
});

export default app;