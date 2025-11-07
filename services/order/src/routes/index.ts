import express from "express";
const router = express.Router();
import { checkout, getOrderById, getOrders } from "@/controllers";


router.get('/health', (_req, res) => {
	res.status(200).json({ status: 'UP' });
});

// routes
router.post('/orders/checkout', checkout);
router.get('/orders/:id', getOrderById);
router.get('/orders', getOrders);

export default router