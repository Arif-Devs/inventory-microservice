import express from "express";
import { userRegister, userLogin, verifyToken, verifyEmail } from "@/controllers";
const router = express.Router();



router.get('/health', (_req, res) => {
  res.status(200).json({ health: 'ok' });
});

router.post('/auth/register', userRegister);
router.post('/auth/login', userLogin);
router.post('/auth/verify-token', verifyToken);
router.post('/auth/verify-email', verifyEmail);

export default router
