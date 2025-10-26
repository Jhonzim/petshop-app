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
const repository = __importStar(require("../src/repositories/productsRepository"));
const productsService_1 = require("../src/services/productsService");
(0, vitest_1.describe)('listProducts', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('deve aplicar paginação padrão quando não informada', async () => {
        const spy = vitest_1.vi.spyOn(repository, 'findProducts').mockResolvedValue({
            data: [],
            total: 0
        });
        const result = await (0, productsService_1.listProducts)({});
        (0, vitest_1.expect)(spy).toHaveBeenCalledWith({
            q: undefined,
            category: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            page: 1,
            pageSize: 12
        });
        (0, vitest_1.expect)(result.pagination).toEqual({ page: 1, pageSize: 12, total: 0, totalPages: 1 });
    });
    (0, vitest_1.it)('deve subtrair estoque quando houver quantidade suficiente', async () => {
        const findSpy = vitest_1.vi.spyOn(repository, 'findProductById').mockResolvedValue({
            id: 1,
            name: 'Produto Teste',
            sku: 'SKU-1',
            category: 'Categoria',
            price: 100,
            stock: 5,
            description: 'Descrição',
            imageUrl: 'https://example.com',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const decrementSpy = vitest_1.vi.spyOn(repository, 'decrementProductStock').mockResolvedValue({ stock: 4 });
        const result = await (0, productsService_1.subtractProductStock)(1, 1);
        (0, vitest_1.expect)(findSpy).toHaveBeenCalledWith(1);
        (0, vitest_1.expect)(decrementSpy).toHaveBeenCalledWith(1, 1);
        (0, vitest_1.expect)(result).toEqual({ stock: 4 });
    });
    (0, vitest_1.it)('deve lançar erro quando estoque for insuficiente', async () => {
        vitest_1.vi.spyOn(repository, 'findProductById').mockResolvedValue({ stock: 1 });
        await (0, vitest_1.expect)((0, productsService_1.subtractProductStock)(1, 2)).rejects.toMatchObject({ statusCode: 409 });
    });
    (0, vitest_1.it)('deve rejeitar quando quantidade for inválida', async () => {
        await (0, vitest_1.expect)((0, productsService_1.subtractProductStock)(1, 0)).rejects.toMatchObject({ statusCode: 400 });
    });
});
