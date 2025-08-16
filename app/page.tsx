import { Header } from '@/components/layout/header';
import { Hero } from '@/components/home/hero';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FeaturedProducts } from '@/components/home/featured-products';
import { Newsletter } from '@/components/home/newsletter';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedCategories />
        <FeaturedProducts />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}