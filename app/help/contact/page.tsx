// app/help/contact/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Support • GearHub",
  description:
    "Need help with an order, shipping, returns or anything else? Contact the GearHub support team.",
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { sent?: string; error?: string };
}) {
  const sent = searchParams?.sent === "1";
  const error = searchParams?.error;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Contact Support</h1>
        <p className="text-muted-foreground">
          We usually respond within 1–2 business days.
        </p>
      </div>

      {/* Status */}
      {sent && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          ✅ Thanks! Your message was sent. We’ll be in touch soon.
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          ❌ {decodeURIComponent(error)}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {/* Contact form */}
        <div className="md:col-span-2 rounded-lg border bg-white p-6">
          <form action="/api/contact" method="POST" className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Your name</label>
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                className="w-full rounded-md border px-3 py-2 text-sm bg-white "
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm bg-white font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-md border px-3 py-2 text-sm bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm bg-white font-medium">Subject</label>
              <input
                name="subject"
                required
                minLength={3}
                maxLength={120}
                className="w-full rounded-md border px-3 py-2 text-sm bg-white"
                placeholder="Question about my order"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm bg-white font-medium">Message</label>
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={6}
                className="w-full rounded-md border px-3 py-2 text-sm bg-white"
                placeholder="Write your message here…"
              />
            </div>

            {/* basic honeypot to deter bots */}
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              className="hidden"
            />

            <button
              type="submit"
              className="inline-flex items-center rounded-md border bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Send message
            </button>
          </form>
        </div>

        {/* Sidebar info */}
        <aside className="rounded-lg border bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold">Other ways to reach us</h2>
          <ul className="space-y-2 text-sm">
            <li>
              Email:{" "}
              <a className="underline" href="mailto:support@gearhub.dev">
                support@gearhub.dev
              </a>
            </li>
            <li>Hours: Mon–Fri, 9am–5pm</li>
            <li>
              FAQs:{" "}
              <Link href="/help/faq" className="underline">
                Help & FAQ
              </Link>
            </li>
          </ul>

          <div className="mt-6 text-xs text-muted-foreground">
            By contacting us, you agree to our{" "}
            <Link href="/legal/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </div>
        </aside>
      </div>
    </div>
  );
}
