'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/lib/email'
import { checkoutSchema } from '@/lib/validations'

export async function createOrder(data: z.infer<typeof checkoutSchema>) {
  try {
    const session = await getServerSession(authOptions)
    
    // Generate order number
    const orderNumber = `GH-${Date.now()}`
    
    // Mock cart data - in real app, fetch from database
    const mockCart = {
      items: [
        {
          variantId: 'variant-1',
          quantity: 2,
          unitPrice: 2999, // $29.99 in cents
          lineTotal: 5998,
          product: { name: 'iPhone 15 Case', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400' }
        }
      ],
      subtotal: 5998,
      discountsTotal: 0,
      shippingTotal: data.shippingMethod === 'express' ? 1500 : 0,
      taxTotal: 480, // 8% tax
      grandTotal: 6478
    }

    // Calculate totals
    const subtotal = mockCart.subtotal
    const shippingTotal = mockCart.shippingTotal
    const taxTotal = mockCart.taxTotal
    const grandTotal = subtotal + shippingTotal + taxTotal - mockCart.discountsTotal

    if (data.paymentMethod === 'stripe') {
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: mockCart.items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              images: item.product.image ? [item.product.image] : []
            },
            unit_amount: item.unitPrice
          },
          quantity: item.quantity
        })),
        shipping_options: [{
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingTotal, currency: 'usd' },
            display_name: data.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping'
          }
        }],
        mode: 'payment',
        success_url: `${process.env.NEXTAUTH_URL}/orders/${orderNumber}?payment=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout?payment=cancelled`,
        metadata: {
          orderNumber,
          userId: session?.user?.id || 'guest'
        }
      })

      return {
        success: true,
        orderNumber,
        paymentUrl: session.url
      }
    } else {
      // For COD and Bank Transfer, create order directly
      // In real app, save to database
      console.log('Creating order:', {
        orderNumber,
        userId: session?.user?.id,
        email: data.email,
        paymentMethod: data.paymentMethod,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        items: mockCart.items,
        totals: { subtotal, shippingTotal, taxTotal, grandTotal }
      })

      // Send confirmation emails
      try {
        await sendOrderConfirmation({
          orderNumber,
          customerEmail: data.email,
          customerName: data.shippingAddress.fullName,
          items: mockCart.items,
          totals: { subtotal, shippingTotal, taxTotal, grandTotal },
          shippingAddress: data.shippingAddress,
          paymentMethod: data.paymentMethod
        })

        await sendAdminOrderNotification({
          orderNumber,
          customerEmail: data.email,
          customerName: data.shippingAddress.fullName,
          paymentMethod: data.paymentMethod,
          grandTotal
        })
      } catch (emailError) {
        console.error('Failed to send emails:', emailError)
        // Don't fail the order creation for email errors
      }

      return {
        success: true,
        orderNumber
      }
    }
  } catch (error) {
    console.error('Order creation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order'
    }
  }
}

export async function getOrderByNumber(orderNumber: string) {
  try {
    // Mock order data - in real app, fetch from database
    return {
      id: 'order-1',
      orderNumber,
      email: 'customer@example.com',
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      fulfillmentStatus: 'UNFULFILLED',
      currency: 'USD',
      subtotal: 5998,
      discountsTotal: 0,
      shippingTotal: 0,
      taxTotal: 480,
      grandTotal: 6478,
      placedAt: new Date(),
      items: [
        {
          id: 'item-1',
          quantity: 2,
          unitPrice: 2999,
          lineTotal: 5998,
          product: {
            name: 'iPhone 15 Case',
            image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400'
          },
          variant: {
            name: 'Black'
          }
        }
      ],
      shippingAddress: {
        fullName: 'John Doe',
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        phone: '555-0123'
      },
      payments: [{
        provider: 'COD',
        status: 'INITIATED',
        amount: 6478
      }]
    }
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return null
  }
}

export async function updateOrderStatus(orderNumber: string, status: string) {
  try {
    // In real app, update database and send notifications
    console.log('Updating order status:', { orderNumber, status })
    return { success: true }
  } catch (error) {
    console.error('Failed to update order status:', error)
    return { success: false, error: 'Failed to update order status' }
  }
}