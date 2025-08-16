import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Smartphone, 
  Shield, 
  Zap, 
  Cable, 
  Headphones, 
  Battery, 
  Car,
  Package
} from 'lucide-react';

const categories = [
  {
    name: 'Phone Cases',
    slug: 'cases',
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=200&fit=crop',
    description: 'Protective cases for all devices'
  },
  {
    name: 'Screen Protectors',
    slug: 'screen-protectors',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1574419602047-c70d98d3e16e?w=300&h=200&fit=crop',
    description: 'Crystal clear protection'
  },
  {
    name: 'Chargers',
    slug: 'chargers',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1609592806603-02f4d55aee8c?w=300&h=200&fit=crop',
    description: 'Fast charging solutions'
  },
  {
    name: 'Cables',
    slug: 'cables',
    icon: Cable,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    description: 'Premium quality cables'
  },
  {
    name: 'Earbuds',
    slug: 'earbuds',
    icon: Headphones,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop',
    description: 'Wireless & wired audio'
  },
  {
    name: 'Power Banks',
    slug: 'power-banks',
    icon: Battery,
    image: 'https://images.unsplash.com/photo-1609592806603-02f4d55aee8c?w=300&h=200&fit=crop',
    description: 'Portable power solutions'
  },
  {
    name: 'Car Mounts',
    slug: 'car-mounts',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=200&fit=crop',
    description: 'Safe driving accessories'
  },
  {
    name: 'Accessories',
    slug: 'misc',
    icon: Package,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    description: 'Everything else you need'
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find exactly what you need from our comprehensive collection of mobile accessories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.slug} href={`/c/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}