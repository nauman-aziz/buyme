'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product/product-card'
import { CatalogFilters } from './catalog-filters'
import { CatalogSort } from './catalog-sort'
import { Button } from '@/components/ui/button'
import { Grid, List } from 'lucide-react'

interface CatalogClientProps {
  products: any[]
  categories: any[]
  searchParams: any
}

export function CatalogClient({ products, categories, searchParams }: CatalogClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()
  const params = useSearchParams()

  const handleFilterChange = (filters: Record<string, any>) => {
    const newParams = new URLSearchParams(params.toString())
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (Array.isArray(value)) {
          newParams.delete(key)
          value.forEach(v => newParams.append(key, v))
        } else {
          newParams.set(key, value.toString())
        }
      } else {
        newParams.delete(key)
      }
    })
    
    router.push(`/catalog?${newParams.toString()}`)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:w-64 space-y-6">
        <CatalogFilters
          categories={categories}
          searchParams={searchParams}
          onFilterChange={handleFilterChange}
        />
      </aside>

      {/* Products Area */}
      <div className="flex-1">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            Showing {products.length} products
          </div>
          
          <div className="flex items-center gap-4">
            <CatalogSort 
              searchParams={searchParams}
              onSortChange={handleFilterChange}
            />
            
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}