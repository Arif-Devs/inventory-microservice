import { Request, Response, NextFunction } from "express";
import { getMyCartService } from "../services/getMyCartService";

const getMyCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartSessionId = (req.headers["x-cart-session-id"] as string) || null;

    const items = await getMyCartService(cartSessionId);

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

export default getMyCart;
