"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const usersRepository = __importStar(require("../src/repositories/usersRepository"));
const bcrypt = __importStar(require("bcryptjs"));
const authService = __importStar(require("../src/services/authService"));
const roles_1 = require("../src/types/roles");
vitest_1.vi.mock('bcryptjs', async () => {
    const actual = await vitest_1.vi.importActual('bcryptjs');
    return {
        ...actual,
        compare: vitest_1.vi.fn()
    };
});
(0, vitest_1.describe)('authService.login', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('deve retornar token e usuário quando credenciais são válidas', async () => {
        const user = {
            id: 1,
            name: 'Admin',
            email: 'admin@petbuddy.com',
            passwordHash: 'hashed',
            role: roles_1.Roles.ADMIN
        };
        vitest_1.vi.spyOn(usersRepository, 'findUserByEmail').mockResolvedValue(user);
        vitest_1.vi.spyOn(bcrypt, 'compare').mockResolvedValue(true);
        const result = await authService.login('admin@petbuddy.com', 'admin123');
        (0, vitest_1.expect)(result.user).toMatchObject({ id: 1, email: 'admin@petbuddy.com', role: roles_1.Roles.ADMIN });
        (0, vitest_1.expect)(result.token).toBeDefined();
    });
    (0, vitest_1.it)('deve lançar erro quando usuário não for encontrado', async () => {
        vitest_1.vi.spyOn(usersRepository, 'findUserByEmail').mockResolvedValue(null);
        await (0, vitest_1.expect)(authService.login('missing@petbuddy.com', 'test')).rejects.toMatchObject({ statusCode: 401 });
    });
    (0, vitest_1.it)('deve lançar erro quando senha for inválida', async () => {
        const user = {
            id: 1,
            name: 'Admin',
            email: 'admin@petbuddy.com',
            passwordHash: 'hashed',
            role: roles_1.Roles.ADMIN
        };
        vitest_1.vi.spyOn(usersRepository, 'findUserByEmail').mockResolvedValue(user);
        vitest_1.vi.spyOn(bcrypt, 'compare').mockResolvedValue(false);
        await (0, vitest_1.expect)(authService.login('admin@petbuddy.com', 'wrong')).rejects.toMatchObject({ statusCode: 401 });
    });
});
