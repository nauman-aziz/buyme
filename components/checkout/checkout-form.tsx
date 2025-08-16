'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartStore } from '@/lib/stores/cart-store'
import { useToast } from '@/hooks/use-toast'
import { checkoutSchema } from '@/lib/validations'
import { createOrder } from '@/lib/actions/orders'
import { Truck, CreditCard, Banknote, Building } from 'lucide-react'

export function CheckoutForm() {
  const { data: session } = useSession()
  const { cart, clearCart } = useCartStore()
  const { toast } = useToast()
  const router = useRouter()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email || '',
      paymentMethod: 'stripe',
      shippingAddress: {
        fullName: session?.user?.name || '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        phone: ''
      },
      billingAddress: {
        fullName: session?.user?.name || '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        phone: ''
      },
      sameAsShipping: true,
      shippingMethod: 'standard'
    }
  })

  const watchSameAsShipping = form.watch('sameAsShipping')
  const watchPaymentMethod = form.watch('paymentMethod')

  const onSubmit = async (data: any) => {
    setIsPlacingOrder(true)
    try {
      const orderData = {
        ...data,
        billingAddress: data.sameAsShipping ? data.shippingAddress : data.billingAddress
      }

      const result = await createOrder(orderData)
      
      if (result.success) {
        clearCart()
        
        if (data.paymentMethod === 'stripe' && result.paymentUrl) {
          window.location.href = result.paymentUrl
        } else {
          router.push(`/orders/${result.orderNumber}`)
          toast({
            title: 'Order placed successfully',
            description: 'You will receive a confirmation email shortly.'
          })
        }
      } else {
        throw new Error(result.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Order error:', error)
      toast({
        title: 'Error placing order',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      })
    }
    setIsPlacingOrder(false)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shippingFullName">Full Name</Label>
            <Input
              id="shippingFullName"
              {...form.register('shippingAddress.fullName')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="shippingLine1">Address Line 1</Label>
            <Input
              id="shippingLine1"
              {...form.register('shippingAddress.line1')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="shippingLine2">Address Line 2 (Optional)</Label>
            <Input
              id="shippingLine2"
              {...form.register('shippingAddress.line2')}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shippingCity">City</Label>
              <Input
                id="shippingCity"
                {...form.register('shippingAddress.city')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="shippingState">State</Label>
              <Input
                id="shippingState"
                {...form.register('shippingAddress.state')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="shippingPostalCode">Postal Code</Label>
              <Input
                id="shippingPostalCode"
                {...form.register('shippingAddress.postalCode')}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shippingPhone">Phone Number</Label>
            <Input
              id="shippingPhone"
              type="tel"
              {...form.register('shippingAddress.phone')}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="sameAsShipping"
              checked={watchSameAsShipping}
              onCheckedChange={(checked) => form.setValue('sameAsShipping', !!checked)}
            />
            <Label htmlFor="sameAsShipping">Same as shipping address</Label>
          </div>

          {!watchSameAsShipping && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="billingFullName">Full Name</Label>
                <Input
                  id="billingFullName"
                  {...form.register('billingAddress.fullName')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="billingLine1">Address Line 1</Label>
                <Input
                  id="billingLine1"
                  {...form.register('billingAddress.line1')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="billingLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="billingLine2"
                  {...form.register('billingAddress.line2')}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCity">City</Label>
                  <Input
                    id="billingCity"
                    {...form.register('billingAddress.city')}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="billingState">State</Label>
                  <Input
                    id="billingState"
                    {...form.register('billingAddress.state')}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="billingPostalCode">Postal Code</Label>
                  <Input
                    id="billingPostalCode"
                    {...form.register('billingAddress.postalCode')}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="billingPhone">Phone Number</Label>
                <Input
                  id="billingPhone"
                  type="tel"
                  {...form.register('billingAddress.phone')}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Method */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={form.watch('shippingMethod')}
            onValueChange={(value) => form.setValue('shippingMethod', value)}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="standard" id="standard" />
              <div className="flex items-center flex-1">
                <Truck className="h-5 w-5 mr-3 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="standard" className="font-medium">Standard Shipping</Label>
                  <p className="text-sm text-muted-foreground">5-7 business days</p>
                </div>
                <div className="font-medium">Free</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="express" id="express" />
              <div className="flex items-center flex-1">
                <Truck className="h-5 w-5 mr-3 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="express" className="font-medium">Express Shipping</Label>
                  <p className="text-sm text-muted-foreground">2-3 business days</p>
                </div>
                <div className="font-medium">$15.00</div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={form.watch('paymentMethod')}
            onValueChange={(value) => form.setValue('paymentMethod', value)}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="stripe" id="stripe" />
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                <Label htmlFor="stripe">Credit/Debit Card (Stripe)</Label>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="cod" id="cod" />
              <div className="flex items-center">
                <Banknote className="h-5 w-5 mr-3 text-muted-foreground" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="bank_transfer" id="bank_transfer" />
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-3 text-muted-foreground" />
                <Label htmlFor="bank_transfer">Bank Transfer</Label>
              </div>
            </div>
          </RadioGroup>

          {watchPaymentMethod === 'cod' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Cash on Delivery:</strong> Pay when your order is delivered to your doorstep.
                A small COD fee may apply.
              </p>
            </div>
          )}

          {watchPaymentMethod === 'bank_transfer' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Bank Transfer:</strong> You will receive bank details via email after placing your order.
                Please allow 2-3 business days for payment verification.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Place Order Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isPlacingOrder}
      >
        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
      </Button>
    </form>
  )
}