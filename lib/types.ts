// Common types used throughout the application

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface Product {
  id: string
  slug: string
  name: string
  subtitle?: string
  description?: string
  brand?: string
  featured: boolean
  ratingAvg: number
  ratingCount: number
  categoryId: string
  category: Category
  images: ProductImage[]
  variants: Variant[]
  specs?: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  parentId?: string
  isActive: boolean
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  alt: string
  position: number
}

export interface Variant {
  id: string
  productId: string
  name: string
  sku?: string
  price: number
  compareAtPrice?: number
  cost?: number
  currency: string
  weightGrams?: number
  dimensions?: Record<string, any>
  barcode?: string
  isActive: boolean
  inventory: Inventory
}

export interface Inventory {
  id: string
  variantId: string
  quantity: number
  lowStockThreshold: number
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  email: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  currency: string
  subtotal: number
  discountsTotal: number
  shippingTotal: number
  taxTotal: number
  grandTotal: number
  shippingAddress: Address
  billingAddress: Address
  items: OrderItem[]
  payments: Payment[]
  shipments: Shipment[]
  notes?: string
  placedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id?: string
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface OrderItem {
  id: string
  orderId: string
  variantId: string
  quantity: number
  unitPrice: number
  lineTotal: number
  snapshot: Record<string, any>
}

export interface Payment {
  id: string
  orderId: string
  provider: PaymentProvider
  providerSessionId?: string
  providerPaymentId?: string
  amount: number
  currency: string
  status: PaymentStatus
  raw?: Record<string, any>
  createdAt: Date
}

export interface Shipment {
  id: string
  orderId: string
  courierName: string
  trackingNumber?: string
  status: ShipmentStatus
  handedOverAt?: Date
  deliveredAt?: Date
  raw?: Record<string, any>
}

export interface Cart {
  id: string
  userId?: string
  currency: string
  subtotal: number
  discountsTotal: number
  shippingTotal: number
  taxTotal: number
  grandTotal: number
  items: CartItem[]
  appliedCoupons?: Coupon[]
}

export interface CartItem {
  id: string
  cartId: string
  variantId: string
  quantity: number
  unitPrice: number
  lineTotal: number
  product?: {
    id: string
    name: string
    slug?: string
    image?: string
    variant?: Variant
  }
}

export interface Coupon {
  id: string
  code: string
  description?: string
  type: CouponType
  value: number
  minSubtotal?: number
  startsAt?: Date
  endsAt?: Date
  maxRedemptions?: number
  redemptionsCount: number
}

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  phone?: string
  avatarUrl?: string
  emailVerified?: Date
  addresses?: Address[]
}

export interface ChatSession {
  id: string
  userId?: string
  sessionToken: string
  startedAt: Date
  lastActiveAt: Date
  messages: ChatMessage[]
}

export interface ChatMessage {
  id: string
  chatSessionId: string
  role: MessageRole
  content: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface FAQ {
  id: string
  question: string
  answer: string
  tags: string[]
  isActive: boolean
}

export interface AuditLog {
  id: string
  actorUserId?: string
  action: string
  entityType: string
  entityId: string
  diff?: Record<string, any>
  ip?: string
  userAgent?: string
  createdAt: Date
}

// Enums
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  DISPATCHED = 'DISPATCHED',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  AUTHORIZED = 'AUTHORIZED',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export enum FulfillmentStatus {
  UNFULFILLED = 'UNFULFILLED',
  FULFILLED = 'FULFILLED',
  PARTIAL = 'PARTIAL'
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum ShipmentStatus {
  PREPARING = 'PREPARING',
  DISPATCHED = 'DISPATCHED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED'
}

export enum CouponType {
  PERCENT = 'PERCENT',
  FIXED = 'FIXED'
}

export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM'
}