import { getEmails, sendEmail } from "@/controllers";
import express from "express";
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ health: 'ok' });
});

router.post('/emails/send', sendEmail);
router.get('/emails', getEmails);

export default router