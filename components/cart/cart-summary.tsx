'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Tag, ShoppingBag } from 'lucide-react'

export function CartSummary() {
  const { cart, applyCoupon, removeCoupon } = useCartStore()
  const { toast } = useToast()
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)
    try {
      await applyCoupon(couponCode)
      setCouponCode('')
      toast({
        title: 'Coupon applied',
        description: 'Discount has been applied to your order'
      })
    } catch (error) {
      toast({
        title: 'Invalid coupon',
        description: 'Please check the coupon code and try again',
        variant: 'destructive'
      })
    }
    setIsApplyingCoupon(false)
  }

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon()
      toast({
        title: 'Coupon removed',
        description: 'Discount has been removed from your order'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove coupon',
        variant: 'destructive'
      })
    }
  }

  if (!cart) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coupon Code */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <Button
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || isApplyingCoupon}
            >
              <Tag className="h-4 w-4" />
            </Button>
          </div>

          {cart.appliedCoupons?.map((coupon: any) => (
            <div key={coupon.id} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
              <span className="text-sm text-green-700 font-medium">
                {coupon.code} applied
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-green-600 hover:text-green-800"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>

          {cart.discountsTotal > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discounts</span>
              <span>-{formatCurrency(cart.discountsTotal)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {cart.shippingTotal > 0 
                ? formatCurrency(cart.shippingTotal)
                : 'Free'
              }
            </span>
          </div>

          {cart.taxTotal > 0 && (
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(cart.taxTotal)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(cart.grandTotal)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout">
          <Button className="w-full" size="lg">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Proceed to Checkout
          </Button>
        </Link>

        {/* Continue Shopping */}
        <Link href="/catalog" className="block">
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}