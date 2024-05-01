import express from 'express';
import {
    createProduct,
    deleteProduct,
    getProducts,
    getProductsById,
    updateProduct
} from '../controllers/Products';
import { verifyUser } from '../middleware/AuthUser';

const router = express.Router();

router.get('/products', verifyUser, getProducts);
router.get('/products/:id', verifyUser, getProductsById);
router.post('/products', verifyUser, createProduct);
router.patch('/products/:id', verifyUser, updateProduct);
router.delete('/products/:id', verifyUser, deleteProduct);

export default router;