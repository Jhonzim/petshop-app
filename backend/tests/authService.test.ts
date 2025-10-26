import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as usersRepository from '../src/repositories/usersRepository';
import * as bcrypt from 'bcryptjs';
import * as authService from '../src/services/authService';
import { Roles } from '../src/types/roles';

vi.mock('bcryptjs', async () => {
  const actual = await vi.importActual<typeof import('bcryptjs')>('bcryptjs');
  return {
    ...actual,
    compare: vi.fn()
  };
});

describe('authService.login', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar token e usuário quando credenciais são válidas', async () => {
    const user = {
      id: 1,
      name: 'Admin',
      email: 'admin@petbuddy.com',
      passwordHash: 'hashed',
  role: Roles.ADMIN
    } as any;

    vi.spyOn(usersRepository, 'findUserByEmail').mockResolvedValue(user);
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await authService.login('admin@petbuddy.com', 'admin123');

  expect(result.user).toMatchObject({ id: 1, email: 'admin@petbuddy.com', role: Roles.ADMIN });
    expect(result.token).toBeDefined();
  });

  it('deve lançar erro quando usuário não for encontrado', async () => {
    vi.spyOn(usersRepository, 'findUserByEmail').mockResolvedValue(null);

    await expect(authService.login('missing@petbuddy.com', 'test')).rejects.toMatchObject({ statusCode: 401 });
  });

  it('deve lançar erro quando senha for inválida', async () => {
    const user = {
      id: 1,
      name: 'Admin',
      email: 'admin@petbuddy.com',
      passwordHash: 'hashed',
  role: Roles.ADMIN
    } as any;

    vi.spyOn(usersRepository, 'findUserByEmail').mockResolvedValue(user);
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(authService.login('admin@petbuddy.com', 'wrong')).rejects.toMatchObject({ statusCode: 401 });
  });
});
