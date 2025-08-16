import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/product-actions'
import { ProductDetail } from '@/components/product/product-detail'
import { ProductDetailSkeleton } from '@/components/product/product-detail-skeleton'
import { RelatedProducts } from '@/components/product/related-products'
import { Metadata } from 'next'

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.name} - GearHub`,
    description: product.subtitle || product.description?.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.subtitle || product.description?.substring(0, 160),
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductContent slug={params.slug} />
      </Suspense>
    </div>
  )
}

async function ProductContent({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-12">
      <ProductDetail product={product} />
      <RelatedProducts 
        categoryId={product.categoryId} 
        currentProductId={product.id}
      />
    </div>
  )
}