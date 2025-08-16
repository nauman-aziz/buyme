import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Mock data - in real app, this would come from the database
const featuredProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max Case',
    slug: 'iphone-15-pro-max-case',
    subtitle: 'Premium Protection',
    price: 2999,
    compareAtPrice: 3999,
    image: 'https://images.unsplash.com/photo-1556618666-fcd25c85cd64?w=400&h=400&fit=crop',
    brand: 'TechArmor',
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Wireless Charging Pad',
    slug: 'wireless-charging-pad',
    subtitle: '15W Fast Charging',
    price: 1999,
    compareAtPrice: 2499,
    image: 'https://images.unsplash.com/photo-1609592806603-02f4d55aee8c?w=400&h=400&fit=crop',
    brand: 'ChargeMaster',
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Bluetooth Earbuds Pro',
    slug: 'bluetooth-earbuds-pro',
    subtitle: 'Noise Cancelling',
    price: 7999,
    compareAtPrice: 9999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
    brand: 'AudioTech',
    rating: 4.9,
    reviewCount: 267,
    inStock: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Tempered Glass Screen Protector',
    slug: 'tempered-glass-screen-protector',
    subtitle: '9H Hardness',
    price: 999,
    compareAtPrice: 1299,
    image: 'https://images.unsplash.com/photo-1574419602047-c70d98d3e16e?w=400&h=400&fit=crop',
    brand: 'GlassTech',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    featured: true,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Handpicked products with exceptional quality and value
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/catalog?featured=true">
              View All Featured
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12 sm:hidden">
          <Button asChild variant="outline">
            <Link href="/catalog?featured=true">
              View All Featured
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}