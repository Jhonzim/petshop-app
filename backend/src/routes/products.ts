import { Router } from 'express';
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProduct,
  handleListProducts,
  handleUpdateProduct
} from '../controllers/productsController';
import { validateBody, validateQuery } from '../middlewares/validate';
import { productBodySchema, productQuerySchema } from '../validations/productSchemas';

const router = Router();

router.get('/', validateQuery(productQuerySchema), handleListProducts);
router.get('/:id', handleGetProduct);
router.post('/', validateBody(productBodySchema), handleCreateProduct);
router.put('/:id', validateBody(productBodySchema), handleUpdateProduct);
router.delete('/:id', handleDeleteProduct);

export default router;
