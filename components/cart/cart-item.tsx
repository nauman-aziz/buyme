'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatCurrency } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

interface CartItemProps {
  item: any
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCartStore()

  const handleQuantityChange = (quantity: number) => {
    updateItem(item.id, { quantity })
  }

  const handleRemove = () => {
    removeItem(item.id)
  }

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.product.image || '/placeholder.jpg'}
          alt={item.product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link 
              href={`/p/${item.product.slug || '#'}`}
              className="font-medium hover:underline line-clamp-2"
            >
              {item.product.name}
            </Link>
            {item.variant && (
              <p className="text-sm text-muted-foreground mt-1">
                {item.variant.name}
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Qty:</label>
              <Select
                value={item.quantity.toString()}
                onValueChange={(value) => handleQuantityChange(parseInt(value))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {formatCurrency(item.unitPrice)} each
            </div>
          </div>

          <div className="text-right">
            <div className="font-semibold">
              {formatCurrency(item.lineTotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}