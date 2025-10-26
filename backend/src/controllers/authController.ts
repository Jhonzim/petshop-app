import { Request, Response, NextFunction } from 'express';
import { login } from '../services/authService';

export async function handleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
