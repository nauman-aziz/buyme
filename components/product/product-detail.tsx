'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/stores/cart-store'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'

interface ProductDetailProps {
  product: any
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast({
        title: 'Please select a variant',
        variant: 'destructive'
      })
      return
    }

    addItem({
      variantId: selectedVariant.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        image: product.images?.[0]?.url,
        variant: selectedVariant
      }
    })

    toast({
      title: 'Added to cart',
      description: `${quantity}x ${product.name} added to your cart`
    })
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
            alt={product.images?.[selectedImage]?.alt || product.name}
            fill
            className="object-cover"
          />
        </div>
        
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                  index === selectedImage ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{product.category?.name}</Badge>
            {product.featured && <Badge>Featured</Badge>}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {product.subtitle && (
            <p className="text-lg text-muted-foreground mb-4">{product.subtitle}</p>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingAvg || 0)}
              <span className="text-sm text-muted-foreground ml-2">
                ({product.ratingCount || 0} reviews)
              </span>
            </div>
          </div>

          {selectedVariant && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {formatCurrency(selectedVariant.price)}
                </span>
                {selectedVariant.compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(selectedVariant.compareAtPrice)}
                  </span>
                )}
              </div>
              
              {selectedVariant.inventory && (
                <div className="text-sm">
                  {selectedVariant.inventory.quantity > 0 ? (
                    <span className="text-green-600">
                      ✓ In stock ({selectedVariant.inventory.quantity} available)
                    </span>
                  ) : (
                    <span className="text-red-600">✗ Out of stock</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Variant Selection */}
        {product.variants && product.variants.length > 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Choose Variant:</label>
              <Select
                value={selectedVariant?.id}
                onValueChange={(value) => {
                  const variant = product.variants.find((v: any) => v.id === value)
                  setSelectedVariant(variant)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant: any) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.name} - {formatCurrency(variant.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-2">Quantity:</label>
          <Select
            value={quantity.toString()}
            onValueChange={(value) => setQuantity(parseInt(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...Array(Math.min(10, selectedVariant?.inventory?.quantity || 1))].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.inventory?.quantity === 0}
            className="flex-1"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
          
          <Button variant="outline" size="lg">
            <Heart className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="lg">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Features */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Free Shipping</div>
                  <div className="text-sm text-muted-foreground">On orders over $50</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">1 Year Warranty</div>
                  <div className="text-sm text-muted-foreground">Full coverage</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">30-Day Returns</div>
                  <div className="text-sm text-muted-foreground">No questions asked</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {product.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {product.description}
            </div>
          </div>
        )}

        {/* Specifications */}
        {product.specs && (
          <div>
            <h3 className="font-semibold mb-2">Specifications</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}