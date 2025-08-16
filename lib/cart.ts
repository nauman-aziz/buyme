import { db } from './db';
import { Cart, CartItem, Variant } from '@prisma/client';

export interface CartWithItems extends Cart {
  items: (CartItem & {
    variant: Variant & {
      product: {
        id: string;
        name: string;
        slug: string;
        images: { url: string; alt: string | null }[];
      };
    };
  })[];
}

export async function getOrCreateCart(userId?: string, sessionToken?: string): Promise<CartWithItems> {
  let cart = await db.cart.findFirst({
    where: userId ? { userId } : { sessionToken },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    select: { url: true, alt: true },
                    orderBy: { position: 'asc' },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: {
        userId,
        sessionToken,
        currency: process.env.STORE_CURRENCY || 'USD',
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: {
                      select: { url: true, alt: true },
                      orderBy: { position: 'asc' },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<CartWithItems> {
  // Get variant with price
  const variant = await db.variant.findUnique({
    where: { id: variantId },
    select: { price: true },
  });

  if (!variant) {
    throw new Error('Variant not found');
  }

  // Check if item already exists in cart
  const existingItem = await db.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId,
        variantId,
      },
    },
  });

  if (existingItem) {
    // Update existing item
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
        lineTotal: (existingItem.quantity + quantity) * variant.price,
      },
    });
  } else {
    // Create new item
    await db.cartItem.create({
      data: {
        cartId,
        variantId,
        quantity,
        unitPrice: variant.price,
        lineTotal: quantity * variant.price,
      },
    });
  }

  // Recalculate cart totals
  await recalculateCartTotals(cartId);

  // Return updated cart
  return getCartById(cartId);
}

export async function updateCartItem(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<CartWithItems> {
  if (quantity <= 0) {
    return removeFromCart(cartId, variantId);
  }

  const variant = await db.variant.findUnique({
    where: { id: variantId },
    select: { price: true },
  });

  if (!variant) {
    throw new Error('Variant not found');
  }

  await db.cartItem.update({
    where: {
      cartId_variantId: {
        cartId,
        variantId,
      },
    },
    data: {
      quantity,
      lineTotal: quantity * variant.price,
    },
  });

  await recalculateCartTotals(cartId);
  return getCartById(cartId);
}

export async function removeFromCart(cartId: string, variantId: string): Promise<CartWithItems> {
  await db.cartItem.delete({
    where: {
      cartId_variantId: {
        cartId,
        variantId,
      },
    },
  });

  await recalculateCartTotals(cartId);
  return getCartById(cartId);
}

export async function clearCart(cartId: string): Promise<void> {
  await db.cartItem.deleteMany({
    where: { cartId },
  });

  await db.cart.update({
    where: { id: cartId },
    data: {
      subtotal: 0,
      discountsTotal: 0,
      shippingTotal: 0,
      taxTotal: 0,
      grandTotal: 0,
    },
  });
}

async function recalculateCartTotals(cartId: string): Promise<void> {
  const items = await db.cartItem.findMany({
    where: { cartId },
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingTotal = calculateShipping(subtotal);
  const taxTotal = calculateTax(subtotal);
  const grandTotal = subtotal + shippingTotal + taxTotal;

  await db.cart.update({
    where: { id: cartId },
    data: {
      subtotal,
      shippingTotal,
      taxTotal,
      grandTotal,
    },
  });
}

function calculateShipping(subtotal: number): number {
  // Free shipping over $50
  return subtotal >= 5000 ? 0 : 500; // $5 shipping
}

function calculateTax(subtotal: number): number {
  // Simple tax calculation - 8%
  return Math.round(subtotal * 0.08);
}

async function getCartById(cartId: string): Promise<CartWithItems> {
  const cart = await db.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    select: { url: true, alt: true },
                    orderBy: { position: 'asc' },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  return cart;
}