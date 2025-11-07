import { NextFunction, Request, Response } from "express";
import { CartService } from "../services/addToCartService";

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Validate request
        const parsedBody = CartService.validateBody(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error.errors });
        }

        const { productId, inventoryId, quantity } = parsedBody.data;

        // 2. Get or create session
        const incomingSessionId = req.headers["x-cart-session-id"] as string;
        const cartSessionId = await CartService.getOrCreateSession(incomingSessionId);

        // Set session in header (if newly created)
        res.setHeader("x-cart-session-id", cartSessionId!);

        // 3. Inventory check
        const available = await CartService.checkInventory(inventoryId, quantity);
        if (!available) {
            return res.status(400).json({ message: "product is not available in inventory" });
        }

        // 4. Add to cart
        await CartService.addItemToCart(cartSessionId!, productId, {
            inventoryId,
            quantity,
        });

        // 5. Update inventory
        await CartService.updateInventory(inventoryId, quantity);

        return res.status(200).json({
            message: "your item is added to cart successfully!",
            cartSessionId,
        });
    } catch (error) {
        next(error);
    }
};

export default addToCart