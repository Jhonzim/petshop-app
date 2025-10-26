import { Request, Response, NextFunction } from 'express';
import {
  createNewProduct,
  getProduct,
  listProducts,
  removeProduct,
  updateExistingProduct,
  subtractProductStock
} from '../services/productsService';

export async function handleListProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listProducts(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function handleGetProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const product = await getProduct(id);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function handleCreateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await createNewProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const product = await updateExistingProduct(id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await removeProduct(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function handleSubtractStock(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { amount } = req.body;
    const product = await subtractProductStock(id, amount);
    res.json(product);
  } catch (error) {
    next(error);
  }
}
