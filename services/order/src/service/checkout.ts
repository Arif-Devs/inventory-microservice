import { CART_SERVICE, PRODUCT_SERVICE } from '@/config/db';
import prisma from '@/config/prisma';
import sendToQueue from '@/queue/queue';
import { CartItemSchema, OrderSchema } from '@/schema/schemas';
import axios from 'axios';
import { z } from 'zod';

export const checkoutService = async (body: any) => {
  // validate request
  const parsedBody = OrderSchema.safeParse(body);
  if (!parsedBody.success) {
    return {
      success: false,
      status: 400,
      errors: parsedBody.error.errors,
    };
  }

  // get cart details
  const { data: cartData } = await axios.get(`${CART_SERVICE}/cart/me`, {
    headers: {
      'x-cart-session-id': parsedBody.data.cartSessionId,
    },
  });

  const cartItems = z.array(CartItemSchema).safeParse(cartData.items);
  if (!cartItems.success) {
    return {
      success: false,
      status: 400,
      errors: cartItems.error.errors,
    };
  }

  if (cartItems.data.length === 0) {
    return {
      success: false,
      status: 400,
      message: 'Cart is empty',
    };
  }

  // get product details from cart items
  const productDetails = await Promise.all(
    cartItems.data.map(async (item) => {
      const { data: product } = await axios.get(
        `${PRODUCT_SERVICE}/products/${item.productId}`
      );
      return {
        productId: product.id as string,
        productName: product.name as string,
        sku: product.sku as string,
        price: product.price as number,
        quantity: item.quantity,
        total: product.price * item.quantity,
      };
    })
  );

  const subtotal = productDetails.reduce((acc, item) => acc + item.total, 0);
  const tax = 0;
  const grandTotal = subtotal + tax;

  // create order
  const order = await prisma.order.create({
    data: {
      userId: parsedBody.data.userId,
      userName: parsedBody.data.userName,
      userEmail: parsedBody.data.userEmail,
      subtotal,
      tax,
      grandTotal,
      orderItems: {
        create: productDetails.map((item) => ({
          ...item,
        })),
      },
    },
  });

  console.log('Order created: ', order.id);

  // send to queue
  sendToQueue('send-email', JSON.stringify(order));
  sendToQueue(
    'clear-cart',
    JSON.stringify({ cartSessionId: parsedBody.data.cartSessionId })
  );

  return {
    success: true,
    status: 201,
    data: order,
  };
};
