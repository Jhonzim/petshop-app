import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next({
        statusCode: 400,
        message: 'Erro de validação',
        details: result.error.flatten()
      });
    }

    req.body = result.data;
    return next();
  };

export const validateQuery = (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next({
        statusCode: 400,
        message: 'Erro de validação',
        details: result.error.flatten()
      });
    }

    req.query = result.data;
    return next();
  };
