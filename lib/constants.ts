export const STORE_CONFIG = {
  name: process.env.STORE_NAME || 'GearHub',
  currency: process.env.STORE_CURRENCY || 'USD',
  supportEmail: process.env.STORE_SUPPORT_EMAIL || 'support@demo.dev',
} as const;

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  IN_REVIEW: 'In Review',
  DISPATCHED: 'Dispatched',
  ON_THE_WAY: 'On the Way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
} as const;

export const PAYMENT_STATUS_LABELS = {
  UNPAID: 'Unpaid',
  AUTHORIZED: 'Authorized',
  PAID: 'Paid',
  REFUNDED: 'Refunded',
} as const;

export const FULFILLMENT_STATUS_LABELS = {
  UNFULFILLED: 'Unfulfilled',
  FULFILLED: 'Fulfilled',
  PARTIAL: 'Partial',
} as const;

export const SHIPMENT_STATUS_LABELS = {
  PREPARING: 'Preparing',
  DISPATCHED: 'Dispatched',
  IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
} as const;

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PKR: 'Rs',
} as const;

export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 20;