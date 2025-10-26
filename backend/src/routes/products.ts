import { Router } from 'express';
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProduct,
  handleListProducts,
  handleUpdateProduct,
  handleSubtractStock
} from '../controllers/productsController';
import { validateBody, validateQuery } from '../middlewares/validate';
import { productBodySchema, productQuerySchema, productStockUpdateSchema } from '../validations/productSchemas';
import { authenticate } from '../middlewares/auth';
import { Roles } from '../types/roles';

const router = Router();

const authenticatedRoles = [Roles.ADMIN, Roles.BUYER];

router.get('/', authenticate(authenticatedRoles), validateQuery(productQuerySchema), handleListProducts);
router.get('/:id', authenticate(authenticatedRoles), handleGetProduct);
router.post('/', authenticate([Roles.ADMIN]), validateBody(productBodySchema), handleCreateProduct);
router.put('/:id', authenticate([Roles.ADMIN]), validateBody(productBodySchema), handleUpdateProduct);
router.delete('/:id', authenticate([Roles.ADMIN]), handleDeleteProduct);
router.post(
  '/:id/decrement',
  authenticate([Roles.BUYER]),
  validateBody(productStockUpdateSchema),
  handleSubtractStock
);

export default router;
