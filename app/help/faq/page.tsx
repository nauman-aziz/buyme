// app/help/faq/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

// ---- Prisma singleton (safe in dev) ----
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}
const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

// ---- SEO ----
export const metadata: Metadata = {
  title: "Help & FAQ • GearHub",
  description:
    "Answers to common questions about orders, shipping, returns, and our products.",
};

// ---- Types (optional) ----
type SearchParams = { q?: string };

// ---- Page ----
export default async function HelpFaqPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const q =
    typeof searchParams?.q === "string" && searchParams.q.trim().length > 0
      ? searchParams.q.trim()
      : undefined;

  const faqs = await prisma.faq.findMany({
    where: {
      isActive: true,
      ...(q
        ? {
            OR: [
              { question: { contains: q, mode: "insensitive" } },
              { answer: { contains: q, mode: "insensitive" } },
              // if tags is String[] in Prisma:
              { tags: { has: q } },
            ],
          }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Help & FAQs</h1>
        <p className="text-muted-foreground">
          Find quick answers to common questions. Can’t find what you need?{" "}
          <Link href="/help/contact" className="text-primary underline">
            Contact support
          </Link>
          .
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6">
        <div className="flex items-center gap-2">
          <input
            className="w-full md:w-2/3 rounded-md border px-3 py-2 text-sm bg-white"
            type="text"
            name="q"
            placeholder="Search FAQs (e.g. shipping, returns, warranty)"
            defaultValue={q || ""}
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-md border bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Search
          </button>
        </div>
        {q && (
          <div className="mt-2 text-sm text-muted-foreground">
            Showing results for <span className="font-medium">“{q}”</span>.{" "}
            <Link href="/help/faq" className="underline">
              Clear
            </Link>
          </div>
        )}
      </form>

      {/* Results */}
      {faqs.length === 0 ? (
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">
            No FAQs matched your search. Try a different keyword or{" "}
            <Link href="/help/contact" className="underline">
              reach out to us
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {faqs.map((f) => (
            <li key={f.id} className="rounded-lg border bg-white">
              <details className="group">
                <summary className="cursor-pointer list-none px-4 py-3 text-base font-medium hover:bg-gray-50 [&::-webkit-details-marker]:hidden flex items-start justify-between">
                  <span>{f.question}</span>
                  <span className="ml-3 text-muted-foreground transition-transform group-open:-rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="px-4 pb-4 pt-1 text-sm leading-relaxed text-gray-700">
                  <p className="mb-3 whitespace-pre-line">{f.answer}</p>
                  {Array.isArray(f.tags) && f.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {f.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}

      {/* Extra help */}
      <div className="mt-10 rounded-lg border bg-white p-6">
        <h2 className="mb-2 text-xl font-semibold">Still need help?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Our support team is here for you Monday–Friday.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/help/contact"
            className="inline-flex items-center rounded-md border bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Contact support
          </Link>
          <Link
            href="/orders"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Track my order
          </Link>
        </div>
      </div>
    </div>
  );
}
