'use server'

import { db } from '@/lib/db'

export async function getProducts(searchParams: any = {}) {
  try {
    const { q, category, brand, minPrice, maxPrice, sort, inStock } = searchParams
    
    // Mock product data - in real app, query database
    let products = [
      {
        id: '1',
        slug: 'iphone-15-silicone-case',
        name: 'iPhone 15 Silicone Case',
        subtitle: 'Premium protection with style',
        description: 'Keep your iPhone 15 protected with this premium silicone case. Features precise cutouts and wireless charging compatibility.',
        brand: 'Apple',
        featured: true,
        ratingAvg: 4.5,
        ratingCount: 128,
        categoryId: 'cases',
        category: { name: 'Cases', slug: 'cases' },
        images: [
          { url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600', alt: 'iPhone 15 Case' }
        ],
        variants: [
          { 
            id: 'var-1', 
            name: 'Black', 
            price: 2999, 
            compareAtPrice: 3499,
            inventory: { quantity: 50 } 
          },
          { 
            id: 'var-2', 
            name: 'Blue', 
            price: 2999,
            inventory: { quantity: 30 } 
          }
        ],
        specs: {
          material: 'Premium Silicone',
          compatibility: 'iPhone 15',
          features: 'Wireless Charging Compatible'
        }
      },
      {
        id: '2',
        slug: 'samsung-s24-screen-protector',
        name: 'Samsung Galaxy S24 Screen Protector',
        subtitle: 'Crystal clear protection',
        description: 'Ultra-thin tempered glass screen protector for Samsung Galaxy S24. 99% transparency with bubble-free installation.',
        brand: 'Samsung',
        featured: false,
        ratingAvg: 4.7,
        ratingCount: 89,
        categoryId: 'screen-protectors',
        category: { name: 'Screen Protectors', slug: 'screen-protectors' },
        images: [
          { url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600', alt: 'Screen Protector' }
        ],
        variants: [
          { 
            id: 'var-3', 
            name: 'Single Pack', 
            price: 1999,
            inventory: { quantity: 100 } 
          },
          { 
            id: 'var-4', 
            name: 'Twin Pack', 
            price: 3499,
            inventory: { quantity: 75 } 
          }
        ],
        specs: {
          thickness: '0.33mm',
          hardness: '9H',
          transparency: '99%'
        }
      },
      {
        id: '3',
        slug: 'anker-powercore-20000',
        name: 'Anker PowerCore 20000mAh Power Bank',
        subtitle: 'Massive capacity, compact design',
        description: 'High-capacity portable charger with fast charging technology. Charge multiple devices simultaneously.',
        brand: 'Anker',
        featured: true,
        ratingAvg: 4.8,
        ratingCount: 256,
        categoryId: 'power-banks',
        category: { name: 'Power Banks', slug: 'power-banks' },
        images: [
          { url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600', alt: 'Power Bank' }
        ],
        variants: [
          { 
            id: 'var-5', 
            name: 'Black', 
            price: 4999,
            compareAtPrice: 5999,
            inventory: { quantity: 25 } 
          },
          { 
            id: 'var-6', 
            name: 'White', 
            price: 4999,
            inventory: { quantity: 15 } 
          }
        ],
        specs: {
          capacity: '20000mAh',
          input: 'USB-C',
          output: '2x USB-A + 1x USB-C',
          fastCharging: 'PowerIQ 3.0'
        }
      }
    ]

    // Apply filters
    if (q) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
      )
    }

    if (category) {
      products = products.filter(p => p.category.slug === category)
    }

    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand]
      products = products.filter(p => brands.includes(p.brand))
    }

    if (minPrice || maxPrice) {
      products = products.filter(p => {
        const price = Math.min(...p.variants.map(v => v.price))
        return (!minPrice || price >= minPrice * 100) && (!maxPrice || price <= maxPrice * 100)
      })
    }

    if (inStock === 'true') {
      products = products.filter(p => 
        p.variants.some(v => v.inventory.quantity > 0)
      )
    }

    // Apply sorting
    switch (sort) {
      case 'price-low-high':
        products.sort((a, b) => {
          const aPrice = Math.min(...a.variants.map(v => v.price))
          const bPrice = Math.min(...b.variants.map(v => v.price))
          return aPrice - bPrice
        })
        break
      case 'price-high-low':
        products.sort((a, b) => {
          const aPrice = Math.min(...a.variants.map(v => v.price))
          const bPrice = Math.min(...b.variants.map(v => v.price))
          return bPrice - aPrice
        })
        break
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'rating':
        products.sort((a, b) => b.ratingAvg - a.ratingAvg)
        break
      case 'newest':
        // Mock newest sort - in real app would sort by createdAt
        products.reverse()
        break
      default:
        // Featured first
        products.sort((a, b) => Number(b.featured) - Number(a.featured))
    }

    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const products = await getProducts()
    return products.find(p => p.slug === slug) || null
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export async function getCategories() {
  try {
    // Mock categories - in real app, fetch from database
    return [
      { id: 'cases', slug: 'cases', name: 'Cases', description: 'Protective cases for all devices' },
      { id: 'screen-protectors', slug: 'screen-protectors', name: 'Screen Protectors', description: 'Crystal clear protection' },
      { id: 'chargers', slug: 'chargers', name: 'Chargers', description: 'Fast and reliable charging' },
      { id: 'cables', slug: 'cables', name: 'Cables', description: 'High-quality charging cables' },
      { id: 'power-banks', slug: 'power-banks', name: 'Power Banks', description: 'Portable power solutions' },
      { id: 'earbuds', slug: 'earbuds', name: 'Earbuds', description: 'Wireless and wired audio' },
      { id: 'car-mounts', slug: 'car-mounts', name: 'Car Mounts', description: 'Secure phone mounting' },
      { id: 'misc', slug: 'misc', name: 'Accessories', description: 'Other mobile accessories' }
    ]
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string) {
  try {
    const products = await getProducts({ category: categoryId })
    return products.filter(p => p.id !== excludeProductId).slice(0, 4)
  } catch (error) {
    console.error('Failed to fetch related products:', error)
    return []
  }
}