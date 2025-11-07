import express from "express";
const router = express.Router();
import { getProducts, getProductDetails, createProduct } from "@/controllers";
import updateProducts from "@/controllers/updateProducts";

router.get('/health', (_req, res) => {
	res.status(200).json({ status: 'UP' });
});

// routes
router.get('/products/:id', getProductDetails);
router.put('/products/:id', updateProducts);
router.get('/products', getProducts);
router.post('/products', createProduct);

export default router