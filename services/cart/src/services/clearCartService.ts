import redis from "@/config/redis";

export const CartService = {

    async sessionExists(cartSessionId: string) {
        return redis.exists(`sessions:${cartSessionId}`);
    },

    async clearCart(cartSessionId: string) {
        await redis.del(`sessions:${cartSessionId}`);
        await redis.del(`cart:${cartSessionId}`);
    },
};
