import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Premium Mobile
              <span className="text-blue-600 dark:text-blue-400"> Accessories</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Discover our curated collection of high-quality mobile accessories. From protective cases to fast chargers, we have everything to keep your devices powered and protected.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/catalog">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/catalog?featured=true">
                  View Featured
                </Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Quality Guaranteed</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <Headphones className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">24/7 Support</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&h=600&fit=crop&crop=center"
                alt="Mobile accessories collection"
                className="w-full h-full object-cover mix-blend-overlay"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}