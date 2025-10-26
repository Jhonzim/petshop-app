export const Roles = {
  ADMIN: 'ADMIN',
  BUYER: 'BUYER'
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export function isRole(value: string): value is Role {
  return Object.values(Roles).includes(value as Role);
}
