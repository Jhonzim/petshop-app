import { compare } from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { isRole, type Role } from '../types/roles';
import { findUserByEmail } from '../repositories/usersRepository';
import { AppError } from '../types/errors';
import { getJwtSecret, JWT_EXPIRES_IN } from '../config/auth';

interface TokenPayload {
  sub: string;
  role: Role;
  name: string;
  email: string;
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const isPasswordValid = await compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const secret = getJwtSecret();
  if (!isRole(user.role)) {
    throw new AppError('Perfil de usuário do servidor inválido.', 500);
  }

  const userRole: Role = user.role;

  const payload: TokenPayload = {
    sub: String(user.id),
    role: userRole,
    name: user.name,
    email: user.email
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: JWT_EXPIRES_IN
  } as SignOptions);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: userRole
    }
  };
}
