const DEFAULT_EXPIRATION = '1d';

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? DEFAULT_EXPIRATION;

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não configurado. Defina a variável de ambiente JWT_SECRET.');
  }
  return secret;
}
