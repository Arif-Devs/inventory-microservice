import express from "express";
import { createUser, getUserById } from "@/controllers";
const router = express.Router();


router.get('/health', (req, res) => {
  res.status(200).json({ health: 'ok' });
});

router.get('/users/:id', getUserById);
router.post('/users', createUser);


export default router