import { NextFunction, Request, Response } from 'express';
import { AppError } from '../types/errors';

interface ErrorLike {
  statusCode?: number;
  message?: string;
  details?: unknown;
}

export function errorHandler(err: ErrorLike, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode ?? (err instanceof AppError ? err.statusCode : 500);
  const message = err.message ?? 'Erro interno no servidor';

  res.status(statusCode).json({
    error: {
      message,
      details: err.details ?? null
    }
  });
}
