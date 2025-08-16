// lib/product-actions.ts
import { PrismaClient } from "@prisma/client";
import type { SearchParams } from "@/lib/types";

// ---- Prisma singleton (safe in Next dev) ----
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}
const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

// ---- Helpers ----
function toBool(v: string | boolean | undefined) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return undefined;
}

function num(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

type SortKey = "newest" | "oldest" | "featured" | "price-asc" | "price-desc";

// ---- Public API ----

/**
 * Fetch products with optional filters and basic pagination.
 * Supported searchParams:
 * - q: string (search in name/brand/description)
 * - category: string (category slug)
 * - featured: "true" | "false"
 * - page: number (default 1)
 * - perPage: number (default 12)
 * - sort: "newest" | "oldest" | "featured" | "price-asc" | "price-desc"
 */
export async function getProducts(searchParams: SearchParams) {
  const {
    q,
    category,
    categorySlug, // tolerate either
    featured,
    page,
    perPage,
    sort,
  } = (searchParams || {}) as Record<string, unknown>;

  const pageNum = num(page, 1);
  const pageSize = num(perPage, 12);
  const featuredBool = toBool(featured as string | boolean);
  const categoryFilter = (categorySlug as string) || (category as string);
  const sortKey: SortKey = (sort as SortKey) || "newest";

  const where: Parameters<typeof prisma.product.findMany>[0]['where'] = {
    isActive: true,
    ...(featuredBool !== undefined ? { featured: featuredBool } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: String(q), mode: "insensitive" } },
            { brand: { contains: String(q), mode: "insensitive" } },
            { description: { contains: String(q), mode: "insensitive" } },
          ],
        }
      : {}),
    ...(categoryFilter
      ? { category: { slug: String(categoryFilter), isActive: true } }
      : {}),
  };

  // Base include: first image + active variants (with inventory)
  const include = {
    images: {
      orderBy: { position: "asc" as const },
      take: 1,
    },
    variants: {
      where: { isActive: true },
      include: { inventory: true },
    },
    category: {
      select: { id: true, name: true, slug: true },
    },
  };

  // For price sorting we need variants; we'll sort in-memory by min variant price.
  // DB orderBy remains by createdAt (or featured) for deterministic paging.
  let orderBy: Parameters<typeof prisma.product.findMany>[0]['orderBy'] = [];
  switch (sortKey) {
    case "oldest":
      orderBy = [{ createdAt: "asc" }];
      break;
    case "featured":
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
      break;
    default:
      // "newest" (and for price sorts, we'll still fetch newest then sort in-memory)
      orderBy = [{ createdAt: "desc" }];
  }

  // Fetch a page
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include,
      orderBy,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  // In-memory price sort if requested
  if (sortKey === "price-asc" || sortKey === "price-desc") {
    items.sort((a, b) => {
      const aMin =
        a.variants.length > 0
          ? Math.min(...a.variants.map((v) => v.price))
          : Number.MAX_SAFE_INTEGER;
      const bMin =
        b.variants.length > 0
          ? Math.min(...b.variants.map((v) => v.price))
          : Number.MAX_SAFE_INTEGER;
      return sortKey === "price-asc" ? aMin - bMin : bMin - aMin;
    });
  }

  // Map a few derived fields often used by UIs (safe to ignore if your client doesn’t need them)
  const products = items.map((p) => {
    const prices = p.variants.map((v) => v.price);
    const minPrice = prices.length ? Math.min(...prices) : null;
    const maxPrice = prices.length ? Math.max(...prices) : null;
    const image = p.images[0]?.url ?? null;

    return {
      ...p,
      image,
      priceRange: { min: minPrice, max: maxPrice },
    };
  });

  // You can also return { products, total, page: pageNum, perPage: pageSize }
  // but your CatalogClient expects just an array, so keep it simple:
  return products;
}

/**
 * Fetch active categories ordered by name.
 * (Adds product counts per category as `productCount`.)
 */
export async function getCategories() {
  const [categories, counts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      // @ts-expect-error
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, description: true },
    }),
    prisma.product.groupBy({
      by: ["categoryId"],
      _count: { _all: true },
      where: { isActive: true },
    }),
  ]);

  const countMap = new Map(counts.map((c) => [c.categoryId, c._count._all]));
  return categories.map((c) => ({
    ...c,
    productCount: countMap.get(c.id) ?? 0,
  }));
}
