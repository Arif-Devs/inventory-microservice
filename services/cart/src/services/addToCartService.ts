import redis from "@/config/redis";
import { CART_TTL, INVENTORY_SERVICE } from "@/config/redisConfig";
import { cartItemSchema } from "@/schema/schemas";
import axios from "axios";
import { v4 as uuid } from "uuid";

export const CartService = {
    validateBody: (body: any) => {
        return cartItemSchema.safeParse(body);
    },

    async getOrCreateSession(existingSessionId?: string) {
        let cartSessionId = existingSessionId || null;

        if (cartSessionId) {
            const exist = await redis.exists(`sessions:${cartSessionId}`);
            if (!exist) cartSessionId = null;
        }

        // create new session if expired or missing
        if (!cartSessionId) {
            cartSessionId = uuid();
            await redis.setex(`sessions:${cartSessionId}`, CART_TTL, cartSessionId!);
        }

        return cartSessionId;
    },

    async checkInventory(inventoryId: string, quantity: number) {
        const { data } = await axios.get(`${INVENTORY_SERVICE}/inventories/${inventoryId}`);
        if (Number(data.quantity) < quantity) {
            return false;
        }
        return true;
    },

    async addItemToCart(cartSessionId: string, productId: string, itemData: any) {
        await redis.hset(`cart:${cartSessionId}`, productId, JSON.stringify(itemData));
    },

    async updateInventory(inventoryId: string, quantity: number) {
        await axios.put(`${INVENTORY_SERVICE}/inventories/${inventoryId}`, {
            quantity,
            actionType: "OUT",
        });
    },
};
