import { NextFunction, Response, RequestHandler, Request } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '../types/roles';
import { AppError } from '../types/errors';
import { getJwtSecret } from '../config/auth';

interface JwtPayload {
  sub: string;
  role: Role;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

function extractToken(header?: string) {
  if (!header) {
    return null;
  }

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

export function authenticate(allowedRoles: Role[] = []): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = extractToken(header);

    if (!token) {
      return next(new AppError('Não autorizado.', 401));
    }

    try {
      const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

      const user = {
        id: Number(payload.sub),
        role: payload.role,
        name: payload.name,
        email: payload.email
      };

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return next(new AppError('Acesso negado.', 403));
      }

      (req as RequestWithUser).user = user;
      return next();
    } catch (error) {
      return next(new AppError('Sessão inválida ou expirada.', 401));
    }
  };
}

interface AuthenticatedUser {
  id: number;
  role: Role;
  name: string;
  email: string;
}

type RequestWithUser = Request & {
  user?: AuthenticatedUser;
};
