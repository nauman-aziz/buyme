import { db } from './db';
import { Order, OrderStatus, PaymentStatus } from '@prisma/client';
import { pusher, PUSHER_CHANNELS, PUSHER_EVENTS } from './pusher';
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from './email';

export async function createOrderFromCart(
  cartId: string,
  shippingAddressId: string,
  billingAddressId: string,
  paymentProvider: 'STRIPE' | 'COD' | 'BANK_TRANSFER'
) {
  return await db.$transaction(async (tx) => {
    // Get cart with items
    const cart = await tx.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
                inventory: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart not found or empty');
    }

    // Check inventory
    for (const item of cart.items) {
      if (!item.variant.inventory || item.variant.inventory.quantity < item.quantity) {
        throw new Error(`Insufficient inventory for ${item.variant.name}`);
      }
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Get addresses
    const [shippingAddress, billingAddress] = await Promise.all([
      tx.address.findUnique({ where: { id: shippingAddressId } }),
      tx.address.findUnique({ where: { id: billingAddressId } }),
    ]);

    if (!shippingAddress || !billingAddress) {
      throw new Error('Address not found');
    }

    // Create order
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: cart.userId,
        email: cart.user?.email || shippingAddress.fullName + '@example.com',
        status: OrderStatus.PENDING,
        paymentStatus: paymentProvider === 'STRIPE' ? PaymentStatus.UNPAID : PaymentStatus.AUTHORIZED,
        currency: cart.currency,
        subtotal: cart.subtotal,
        discountsTotal: cart.discountsTotal,
        shippingTotal: cart.shippingTotal,
        taxTotal: cart.taxTotal,
        grandTotal: cart.grandTotal,
        shippingAddressId,
        billingAddressId,
      },
    });

    // Create order items
    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          snapshot: {
            productName: item.variant.product.name,
            variantName: item.variant.name,
            productSlug: item.variant.product.slug,
            productImages: item.variant.product.images || [],
          },
        },
      });

      // Update inventory
      await tx.inventory.update({
        where: { variantId: item.variantId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Create payment record
    await tx.payment.create({
      data: {
        orderId: order.id,
        provider: paymentProvider,
        amount: order.grandTotal,
        currency: order.currency,
        status: paymentProvider === 'STRIPE' ? 'INITIATED' : 'AUTHORIZED',
      },
    });

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId } });
    await tx.cart.update({
      where: { id: cartId },
      data: {
        subtotal: 0,
        discountsTotal: 0,
        shippingTotal: 0,
        taxTotal: 0,
        grandTotal: 0,
      },
    });

    // Send notifications
    const orderWithDetails = await tx.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        shippingAddress: true,
        user: true,
      },
    });

    if (orderWithDetails) {
      // Send emails
      const emailData = {
        orderNumber: orderWithDetails.orderNumber,
        customerName: orderWithDetails.shippingAddress.fullName,
        customerEmail: orderWithDetails.email,
        items: orderWithDetails.items.map(item => ({
          name: item.variant.product.name,
          variant: item.variant.name,
          quantity: item.quantity,
          price: item.lineTotal,
        })),
        subtotal: orderWithDetails.subtotal,
        shipping: orderWithDetails.shippingTotal,
        tax: orderWithDetails.taxTotal,
        total: orderWithDetails.grandTotal,
        shippingAddress: orderWithDetails.shippingAddress,
      };

      try {
        await Promise.all([
          sendOrderConfirmationEmail(emailData),
          sendAdminNewOrderEmail(emailData),
        ]);
      } catch (error) {
        console.error('Failed to send order emails:', error);
      }

      // Send real-time notifications
      try {
        await pusher.trigger(PUSHER_CHANNELS.ADMIN, PUSHER_EVENTS.ORDER_CREATED, {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: orderWithDetails.shippingAddress.fullName,
          total: order.grandTotal,
        });
      } catch (error) {
        console.error('Failed to send pusher notification:', error);
      }
    }

    return order;
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  userId: string
) {
  const order = await db.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      user: true,
      shippingAddress: true,
    },
  });

  // Create audit log
  await db.auditLog.create({
    data: {
      actorUserId: userId,
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'Order',
      entityId: orderId,
      diff: { status },
    },
  });

  // Send notification to customer
  if (order.userId) {
    try {
      await pusher.trigger(
        PUSHER_CHANNELS.USER(order.userId),
        PUSHER_EVENTS.ORDER_STATUS_UPDATED,
        {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status,
        }
      );
    } catch (error) {
      console.error('Failed to send order status notification:', error);
    }
  }

  return order;
}

async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const prefix = `GH${year}${month}${day}`;

  // Get the latest order number for today
  const latestOrder = await db.order.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      orderNumber: 'desc',
    },
  });

  let sequence = 1;
  if (latestOrder) {
    const lastSequence = parseInt(latestOrder.orderNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  return `${prefix}${sequence.toString().padStart(4, '0')}`;
}