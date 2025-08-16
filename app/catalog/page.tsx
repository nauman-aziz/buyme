import { Suspense } from 'react'
import { SearchParams } from '@/lib/types'
import { CatalogClient } from '@/components/catalog/catalog-client'
import { CatalogSkeleton } from '@/components/catalog/catalog-skeleton'
import { getProducts, getCategories } from '@/lib/product-actions'

interface CatalogPageProps {
  searchParams: SearchParams
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
        <p className="text-muted-foreground">Discover our complete range of mobile accessories</p>
      </div>
      
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories()
  ])
  
  return (
    <CatalogClient 
      products={products}
      categories={categories}
      searchParams={searchParams}
    />
  )
}