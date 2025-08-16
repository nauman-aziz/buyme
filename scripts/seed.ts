import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.dev' },
    update: {},
    create: {
      email: 'admin@demo.dev',
      hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date()
    }
  })

  // Create test customer
  const customerPassword = await bcrypt.hash('Customer123!', 12)
  
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@demo.dev' },
    update: {},
    create: {
      email: 'customer@demo.dev',
      hashedPassword: customerPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
      emailVerified: new Date()
    }
  })

  // Create categories
  const categories = [
    {
      slug: 'cases',
      name: 'Cases',
      description: 'Protective cases for all devices',
      isActive: true
    },
    {
      slug: 'screen-protectors',
      name: 'Screen Protectors',
      description: 'Crystal clear protection for your screen',
      isActive: true
    },
    {
      slug: 'chargers',
      name: 'Chargers',
      description: 'Fast and reliable charging solutions',
      isActive: true
    },
    {
      slug: 'cables',
      name: 'Cables',
      description: 'High-quality charging and data cables',
      isActive: true
    },
    {
      slug: 'power-banks',
      name: 'Power Banks',
      description: 'Portable power for on-the-go charging',
      isActive: true
    },
    {
      slug: 'earbuds',
      name: 'Earbuds',
      description: 'Wireless and wired audio solutions',
      isActive: true
    },
    {
      slug: 'car-mounts',
      name: 'Car Mounts',
      description: 'Secure phone mounting for vehicles',
      isActive: true
    },
    {
      slug: 'misc',
      name: 'Accessories',
      description: 'Other essential mobile accessories',
      isActive: true
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  const createdCategories = await prisma.category.findMany()
  const categoryMap = new Map(createdCategories.map(cat => [cat.slug, cat.id]))

  // Create products with variants
  const products = [
    {
      slug: 'iphone-15-silicone-case',
      name: 'iPhone 15 Silicone Case',
      subtitle: 'Premium protection with style',
      description: 'Keep your iPhone 15 protected with this premium silicone case. Features precise cutouts and wireless charging compatibility.',
      brand: 'Apple',
      categoryId: categoryMap.get('cases')!,
      featured: true,
      isActive: true,
      specs: {
        material: 'Premium Silicone',
        compatibility: 'iPhone 15',
        features: 'Wireless Charging Compatible'
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600',
          alt: 'iPhone 15 Silicone Case',
          position: 0
        }
      ],
      variants: [
        {
          name: 'Black',
          sku: 'IPH15-CASE-BLK',
          price: 2999,
          compareAtPrice: 3499,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 50, lowStockThreshold: 5 }
        },
        {
          name: 'Blue',
          sku: 'IPH15-CASE-BLU',
          price: 2999,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 30, lowStockThreshold: 5 }
        },
        {
          name: 'Pink',
          sku: 'IPH15-CASE-PNK',
          price: 2999,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 25, lowStockThreshold: 5 }
        }
      ]
    },
    {
      slug: 'samsung-s24-screen-protector',
      name: 'Samsung Galaxy S24 Screen Protector',
      subtitle: 'Crystal clear protection',
      description: 'Ultra-thin tempered glass screen protector for Samsung Galaxy S24. 99% transparency with bubble-free installation.',
      brand: 'Samsung',
      categoryId: categoryMap.get('screen-protectors')!,
      featured: false,
      isActive: true,
      specs: {
        thickness: '0.33mm',
        hardness: '9H',
        transparency: '99%',
        compatibility: 'Samsung Galaxy S24'
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600',
          alt: 'Samsung S24 Screen Protector',
          position: 0
        }
      ],
      variants: [
        {
          name: 'Single Pack',
          sku: 'S24-SCREEN-1PK',
          price: 1999,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 100, lowStockThreshold: 10 }
        },
        {
          name: 'Twin Pack',
          sku: 'S24-SCREEN-2PK',
          price: 3499,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 75, lowStockThreshold: 10 }
        }
      ]
    },
    {
      slug: 'anker-powercore-20000',
      name: 'Anker PowerCore 20000mAh Power Bank',
      subtitle: 'Massive capacity, compact design',
      description: 'High-capacity portable charger with fast charging technology. Charge multiple devices simultaneously with PowerIQ 3.0 technology.',
      brand: 'Anker',
      categoryId: categoryMap.get('power-banks')!,
      featured: true,
      isActive: true,
      specs: {
        capacity: '20000mAh',
        input: 'USB-C PD',
        output: '2x USB-A + 1x USB-C',
        fastCharging: 'PowerIQ 3.0',
        weight: '355g'
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600',
          alt: 'Anker PowerCore 20000mAh',
          position: 0
        }
      ],
      variants: [
        {
          name: 'Black',
          sku: 'ANKER-PB20K-BLK',
          price: 4999,
          compareAtPrice: 5999,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 25, lowStockThreshold: 3 }
        },
        {
          name: 'White',
          sku: 'ANKER-PB20K-WHT',
          price: 4999,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 15, lowStockThreshold: 3 }
        }
      ]
    },
    {
      slug: 'airpods-pro-2nd-gen',
      name: 'Apple AirPods Pro (2nd Generation)',
      subtitle: 'Adaptive Audio. Now playing.',
      description: 'AirPods Pro feature up to 2x more Active Noise Cancellation, plus Adaptive Transparency, and Personalized Spatial Audio with dynamic head tracking.',
      brand: 'Apple',
      categoryId: categoryMap.get('earbuds')!,
      featured: true,
      isActive: true,
      specs: {
        chip: 'H2',
        batteryLife: 'Up to 6 hours',
        chargingCase: 'Up to 30 hours',
        activeNoiseCancellation: 'Yes',
        waterResistance: 'IPX4'
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600',
          alt: 'AirPods Pro 2nd Generation',
          position: 0
        }
      ],
      variants: [
        {
          name: 'White',
          sku: 'AIRPODS-PRO-2',
          price: 24900,
          compareAtPrice: 24900,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 12, lowStockThreshold: 2 }
        }
      ]
    },
    {
      slug: 'belkin-15w-wireless-charger',
      name: 'Belkin 15W Wireless Charging Pad',
      subtitle: 'Fast wireless charging made simple',
      description: 'Charge your Qi-enabled devices wirelessly with this sleek 15W charging pad. Compatible with iPhone, Samsung, and other Qi devices.',
      brand: 'Belkin',
      categoryId: categoryMap.get('chargers')!,
      featured: false,
      isActive: true,
      specs: {
        output: '15W max',
        compatibility: 'Qi-enabled devices',
        design: 'Non-slip base',
        ledIndicator: 'Yes'
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',
          alt: 'Belkin Wireless Charger',
          position: 0
        }
      ],
      variants: [
        {
          name: 'Black',
          sku: 'BELKIN-WC15-BLK',
          price: 3999,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 40, lowStockThreshold: 5 }
        },
        {
          name: 'White',
          sku: 'BELKIN-WC15-WHT',
          price: 3999,
          currency: 'USD',
          isActive: true,
          inventory: { quantity: 35, lowStockThreshold: 5 }
        }
      ]
    }
  ]

  for (const productData of products) {
  const { images, variants, ...productInfo } = productData

  const product = await prisma.product.upsert({
    where: { slug: productInfo.slug },
    update: {},
    create: {
      ...productInfo,
      images: { create: images }
    }
  })

  for (const variantData of variants) {
    const { inventory, ...variantInfo } = variantData
    const variant = await prisma.variant.upsert({
      where: { sku: variantInfo.sku },
      update: {},
      create: { ...variantInfo, productId: product.id }
    })

    await prisma.inventory.upsert({
      where: { variantId: variant.id },
      update: {},
      create: { ...inventory, variantId: variant.id }
    })
  }
}


  // Create coupons
  const coupons = [
    {
      code: 'WELCOME20',
      description: 'Welcome discount for new customers',
      type: 'PERCENT',
      value: 20,
      minSubtotal: 2500, // $25
      maxRedemptions: 100,
      redemptionsCount: 0
    },
    {
      code: 'SAVE10',
      description: '10% off any order',
      type: 'PERCENT',
      value: 10,
      maxRedemptions: 500,
      redemptionsCount: 0
    },
    {
      code: 'FLAT50',
      description: '$50 off orders over $100',
      type: 'FIXED',
      value: 5000, // $50 in cents
      minSubtotal: 10000, // $100
      maxRedemptions: 50,
      redemptionsCount: 0
    }
  ]

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon as any
    })
  }

  // Create FAQs
  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all items. Items must be in original condition with tags attached.',
      tags: ['returns', 'policy'],
      isActive: true
    },
    {
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer free standard shipping on orders over $50. Express shipping is available for $15.',
      tags: ['shipping', 'free'],
      isActive: true
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.',
      tags: ['shipping', 'delivery'],
      isActive: true
    },
    {
      question: 'Are your products authentic?',
      answer: 'Yes, all our products are 100% authentic and come with manufacturer warranties.',
      tags: ['authenticity', 'warranty'],
      isActive: true
    },
    {
      question: 'Do you have a physical store?',
      answer: 'We are currently online-only, but we offer excellent customer support via chat and email.',
      tags: ['store', 'location'],
      isActive: true
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. You can also check your order status in your account.',
      tags: ['tracking', 'orders'],
      isActive: true
    }
  ]

  for (const faq of faqs) {
    await prisma.faq.create({
      data: faq
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: admin@demo.dev / Admin123!`)
  console.log(`👤 Test customer: customer@demo.dev / Customer123!`)
  console.log(`📦 Created ${products.length} products`)
  console.log(`🎫 Created ${coupons.length} coupons`)
  console.log(`❓ Created ${faqs.length} FAQs`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })