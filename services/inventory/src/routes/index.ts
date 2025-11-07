import express from "express";
const router = express.Router();
import { createInventory, getInventoryById, getInventoryDetails, updateInventory } from "@/controller";



router.get('/inventories/:id/details', getInventoryDetails);
router.get('/inventories/:id', getInventoryById);
router.put('/inventories/:id', updateInventory);
router.post('/inventories', createInventory);

export default router