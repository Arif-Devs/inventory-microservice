import { addToCart, clearCart, getMyCart } from "@/controllers";
import express from "express";
const router = express.Router();


// health check
router.get('/health', (_req, res) => {
  res.json({ message: 'UP' });
});
// routes
router.post('/cart/add-to-cart', addToCart)
router.get('/cart/me', getMyCart)
router.get('/cart/clear', clearCart);

export default router