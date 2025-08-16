'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CURRENCY_SYMBOLS } from '@/lib/constants';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    subtitle?: string | null;
    price: number;
    compareAtPrice?: number | null;
    image: string;
    brand?: string | null;
    rating?: number;
    reviewCount?: number;
    inStock: boolean;
    featured?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return `${CURRENCY_SYMBOLS.USD}${(price / 100).toFixed(2)}`;
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;

    setIsAddingToCart(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link href={`/p/${product.slug}`}>
      <Card className="group h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-800">
          {product.featured && (
            <Badge className="absolute top-2 left-2 z-10 bg-blue-600">
              Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2 z-10">
              -{discount}%
            </Badge>
          )}
          
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="outline" className="bg-white text-gray-900">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex-1">
            {product.brand && (
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {product.brand}
              </p>
            )}
            
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {product.name}
            </h3>
            
            {product.subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-1">
                {product.subtitle}
              </p>
            )}

            {product.rating && product.reviewCount && (
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className="w-full"
              size="sm"
            >
              {!product.inStock ? (
                'Out of Stock'
              ) : isAddingToCart ? (
                'Adding...'
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}