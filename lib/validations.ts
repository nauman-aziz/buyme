import { z } from 'zod'

// Address schema
export const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().default('US'),
  phone: z.string().min(1, 'Phone number is required')
})

// Checkout schema
export const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  paymentMethod: z.enum(['stripe', 'cod', 'bank_transfer']),
  shippingMethod: z.enum(['standard', 'express']),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  sameAsShipping: z.boolean().default(true)
})

// Product schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  specs: z.record(z.string()).optional(),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false)
})

// Variant schema
export const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  compareAtPrice: z.number().optional(),
  cost: z.number().optional(),
  weightGrams: z.number().optional(),
  isActive: z.boolean().default(true)
})

// Order status update schema
export const orderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'IN_REVIEW', 'DISPATCHED', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  notes: z.string().optional(),
  notifyCustomer: z.boolean().default(true)
})

// Coupon schema
export const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.number().min(0, 'Value must be positive'),
  minSubtotal: z.number().optional(),
  startsAt: z.date().optional(),
  endsAt: z.date().optional(),
  maxRedemptions: z.number().optional()
})

// FAQ schema
export const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  tags: z.array(z.string()).default([])
})

// Admin user creation schema
export const adminUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'ADMIN']).default('CUSTOMER')
})

// Search params schema for products
export const productSearchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.union([z.string(), z.array(z.string())]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(['featured', 'newest', 'price-low-high', 'price-high-low', 'name-asc', 'name-desc', 'rating']).default('featured'),
  inStock: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(12)
})

// Chat message schema
export const chatMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  sessionToken: z.string().optional()
})