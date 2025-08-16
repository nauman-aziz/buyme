'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/stores/cart-store'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { CheckoutSummary } from '@/components/checkout/checkout-summary'
import { LoginPrompt } from '@/components/checkout/login-prompt'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const { cart, items } = useCartStore()
  const router = useRouter()
  const [showGuestCheckout, setShowGuestCheckout] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return <div>Redirecting...</div>
  }

  if (!session && !showGuestCheckout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <LoginPrompt onGuestCheckout={() => setShowGuestCheckout(true)} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your order by filling in the details below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        {/* Order Summary */}
        <div>
          <CheckoutSummary />
        </div>
      </div>
    </div>
  )
}