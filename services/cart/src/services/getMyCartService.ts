// cart.service.ts
import redis from "@/config/redis";

export const getMyCartService = async (cartSessionId: string | null) => {
  if (!cartSessionId) {
    return [];
  }

  // check availability the session id in the store
  const session = await redis.exists(`sessions:${cartSessionId}`);
  if (!session) {
    await redis.del(`cart:${cartSessionId}`);
    return [];
  }

  const items = await redis.hgetall(`cart:${cartSessionId}`);
  if (Object.keys(items).length === 0) {
    return [];
  }

  const formattedItems = Object.keys(items).map((key) => {
    const { quantity, inventoryId } = JSON.parse(items[key]) as {
      inventoryId: string;
      quantity: number;
    };

    return { inventoryId, quantity, productId: key };
  });

  return formattedItems;
};
