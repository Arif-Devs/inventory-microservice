import { CART_TTL } from "@/config";
import redis from "@/redis";
import { cartItemSchema } from "@/schemas";
import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Validate request body
        const parseBody = cartItemSchema.safeParse(req.body)
        if (!parseBody.success) {
            return res.status(400).json({ error: parseBody.error.errors })
        }

        let cartSessionId = (req.headers["x-cart-session-id"] as string) || null
        //check the existence of session id
        if (cartSessionId) {
            const exist = await redis.exists(`sessions:${cartSessionId}`)
            console.log('Session exist: ', exist);

            if (!exist) {
                cartSessionId = null
            }
        }
          //if session is expired create a new one
        if (!cartSessionId) {
            cartSessionId = uuid()
            console.log('new session id:', cartSessionId);
          // set session in redis store

            await redis.setex(`sessions:${cartSessionId!}`, CART_TTL, cartSessionId!)
            //set the cart session in header
            res.setHeader('x-cart-session-id', cartSessionId!)
        }

        await redis.hset(`cart:${cartSessionId!}`, parseBody.data.productId, JSON.stringify({
            inventoryId: parseBody.data.inventoryId,
            quantity: parseBody.data.quantity
        }))

        return res.status(200).json({ message: 'your item is added to cart successfully!', cartSessionId })

    } catch (error) {
        next(error)
    }
}

export default addToCart