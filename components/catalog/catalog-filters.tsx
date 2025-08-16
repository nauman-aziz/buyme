'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface CatalogFiltersProps {
  categories: any[]
  searchParams: any
  onFilterChange: (filters: Record<string, any>) => void
}

export function CatalogFilters({ categories, searchParams, onFilterChange }: CatalogFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.category ? [searchParams.category] : []
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.brand ? (Array.isArray(searchParams.brand) ? searchParams.brand : [searchParams.brand]) : []
  )

  const brands = ['Apple', 'Samsung', 'Anker', 'Belkin', 'OtterBox', 'Spigen', 'UAG']

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedCategories, categorySlug]
      : selectedCategories.filter(c => c !== categorySlug)
    
    setSelectedCategories(newSelected)
    onFilterChange({ ...searchParams, category: newSelected })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedBrands, brand]
      : selectedBrands.filter(b => b !== brand)
    
    setSelectedBrands(newSelected)
    onFilterChange({ ...searchParams, brand: newSelected })
  }

  const handlePriceChange = (range: number[]) => {
    setPriceRange(range)
    onFilterChange({ 
      ...searchParams, 
      minPrice: range[0],
      maxPrice: range[1]
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 1000])
    onFilterChange({})
  }

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search products..."
            defaultValue={searchParams.q || ''}
            onChange={(e) => onFilterChange({ ...searchParams, q: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={(checked) => handleCategoryChange(category.slug, !!checked)}
              />
              <Label htmlFor={`category-${category.slug}`} className="text-sm">
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={searchParams.inStock === 'true'}
              onCheckedChange={(checked) => onFilterChange({ 
                ...searchParams, 
                inStock: checked ? 'true' : undefined 
              })}
            />
            <Label htmlFor="in-stock" className="text-sm">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}