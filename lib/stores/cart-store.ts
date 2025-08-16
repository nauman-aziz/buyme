import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  variantId: string
  quantity: number
  unitPrice: number
  lineTotal: number
  product: {
    id: string
    name: string
    slug?: string
    image?: string
    variant?: any
  }
}

interface Cart {
  id: string
  currency: string
  subtotal: number
  discountsTotal: number
  shippingTotal: number
  taxTotal: number
  grandTotal: number
  appliedCoupons?: any[]
}

interface CartStore {
  cart: Cart | null
  items: CartItem[]
  isLoading: boolean
  
  // Actions
  fetchCart: () => Promise<void>
  addItem: (item: { variantId: string; quantity: number; product: any }) => Promise<void>
  updateItem: (itemId: string, updates: { quantity: number }) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  applyCoupon: (code: string) => Promise<void>
  removeCoupon: () => Promise<void>
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      items: [],
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true })
        try {
          // In a real app, this would fetch from your API
          const response = await fetch('/api/cart')
          const data = await response.json()
          
          set({ 
            cart: data.cart,
            items: data.items || [],
            isLoading: false 
          })
        } catch (error) {
          console.error('Failed to fetch cart:', error)
          set({ isLoading: false })
        }
      },

      addItem: async (item) => {
        set({ isLoading: true })
        try {
          // Optimistic update
          const existingItemIndex = get().items.findIndex(i => i.variantId === item.variantId)
          
          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedItems = [...get().items]
            updatedItems[existingItemIndex].quantity += item.quantity
            updatedItems[existingItemIndex].lineTotal = 
              updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice
            
            set({ items: updatedItems })
          } else {
            // Add new item
            const newItem: CartItem = {
              id: Math.random().toString(36),
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.product.variant?.price || 0,
              lineTotal: item.quantity * (item.product.variant?.price || 0),
              product: item.product
            }
            
            set({ items: [...get().items, newItem] })
          }

          // Update cart totals
          const items = get().items
          const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
          const cart: Cart = {
            id: 'temp-cart',
            currency: 'USD',
            subtotal,
            discountsTotal: 0,
            shippingTotal: subtotal > 5000 ? 0 : 1500, // Free shipping over $50
            taxTotal: Math.round(subtotal * 0.08), // 8% tax
            grandTotal: subtotal + (subtotal > 5000 ? 0 : 1500) + Math.round(subtotal * 0.08)
          }
          
          set({ cart, isLoading: false })

          // In a real app, sync with backend
          // await fetch('/api/cart/add', { method: 'POST', body: JSON.stringify(item) })
          
        } catch (error) {
          console.error('Failed to add item:', error)
          set({ isLoading: false })
        }
      },

      updateItem: async (itemId, updates) => {
        set({ isLoading: true })
        try {
          const updatedItems = get().items.map(item => 
            item.id === itemId 
              ? { ...item, quantity: updates.quantity, lineTotal: updates.quantity * item.unitPrice }
              : item
          )
          
          set({ items: updatedItems })

          // Update cart totals
          const subtotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0)
          const cart: Cart = {
            id: 'temp-cart',
            currency: 'USD',
            subtotal,
            discountsTotal: get().cart?.discountsTotal || 0,
            shippingTotal: subtotal > 5000 ? 0 : 1500,
            taxTotal: Math.round(subtotal * 0.08),
            grandTotal: subtotal + (subtotal > 5000 ? 0 : 1500) + Math.round(subtotal * 0.08) - (get().cart?.discountsTotal || 0)
          }
          
          set({ cart, isLoading: false })
          
        } catch (error) {
          console.error('Failed to update item:', error)
          set({ isLoading: false })
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true })
        try {
          const updatedItems = get().items.filter(item => item.id !== itemId)
          set({ items: updatedItems })

          // Update cart totals
          const subtotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0)
          const cart: Cart = {
            id: 'temp-cart',
            currency: 'USD',
            subtotal,
            discountsTotal: get().cart?.discountsTotal || 0,
            shippingTotal: subtotal > 5000 ? 0 : 1500,
            taxTotal: Math.round(subtotal * 0.08),
            grandTotal: subtotal + (subtotal > 5000 ? 0 : 1500) + Math.round(subtotal * 0.08) - (get().cart?.discountsTotal || 0)
          }
          
          set({ cart, isLoading: false })
          
        } catch (error) {
          console.error('Failed to remove item:', error)
          set({ isLoading: false })
        }
      },

      applyCoupon: async (code) => {
        // Mock coupon application
        const mockCoupons = {
          'SAVE10': { type: 'PERCENT', value: 10 },
          'WELCOME20': { type: 'PERCENT', value: 20 },
          'FLAT50': { type: 'FIXED', value: 5000 } // $50 in cents
        }

        const coupon = mockCoupons[code as keyof typeof mockCoupons]
        if (!coupon) {
          throw new Error('Invalid coupon code')
        }

        const currentCart = get().cart
        if (!currentCart) return

        const discountAmount = coupon.type === 'PERCENT' 
          ? Math.round(currentCart.subtotal * (coupon.value / 100))
          : coupon.value

        const updatedCart = {
          ...currentCart,
          discountsTotal: discountAmount,
          grandTotal: currentCart.subtotal + currentCart.shippingTotal + currentCart.taxTotal - discountAmount,
          appliedCoupons: [{ id: 'temp-coupon', code, ...coupon }]
        }

        set({ cart: updatedCart })
      },

      removeCoupon: async () => {
        const currentCart = get().cart
        if (!currentCart) return

        const updatedCart = {
          ...currentCart,
          discountsTotal: 0,
          grandTotal: currentCart.subtotal + currentCart.shippingTotal + currentCart.taxTotal,
          appliedCoupons: []
        }

        set({ cart: updatedCart })
      },

      clearCart: () => {
        set({ cart: null, items: [] })
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        cart: state.cart 
      })
    }
  )
)