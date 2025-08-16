import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';

const footerLinks = {
  'Shop': [
    { name: 'All Products', href: '/catalog' },
    { name: 'Phone Cases', href: '/c/cases' },
    { name: 'Chargers', href: '/c/chargers' },
    { name: 'Earbuds', href: '/c/earbuds' },
    { name: 'Power Banks', href: '/c/power-banks' },
    { name: 'Screen Protectors', href: '/c/screen-protectors' },
  ],
  'Support': [
    { name: 'Help Center', href: '/help' },
    { name: 'Order Tracking', href: '/orders' },
    { name: 'Returns & Refunds', href: '/help/returns' },
    { name: 'Warranty', href: '/help/warranty' },
    { name: 'Contact Us', href: '/help/contact' },
    { name: 'FAQ', href: '/help/faq' },
  ],
  'Company': [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
    { name: 'Affiliate Program', href: '/affiliate' },
    { name: 'Blog', href: '/blog' },
  ],
  'Legal': [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
    { name: 'Shipping Policy', href: '/legal/shipping' },
    { name: 'Return Policy', href: '/legal/returns' },
    { name: 'Accessibility', href: '/legal/accessibility' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'YouTube', href: '#', icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust badges */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-8 w-8 text-green-400" />
              <div className="text-left">
                <div className="font-semibold">Secure Payments</div>
                <div className="text-sm text-gray-400">SSL encrypted checkout</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Truck className="h-8 w-8 text-blue-400" />
              <div className="text-left">
                <div className="font-semibold">Free Shipping</div>
                <div className="text-sm text-gray-400">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CreditCard className="h-8 w-8 text-purple-400" />
              <div className="text-left">
                <div className="font-semibold">Easy Returns</div>
                <div className="text-sm text-gray-400">30-day return policy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GH</span>
              </div>
              <span className="text-xl font-bold">GearHub</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your trusted destination for premium mobile accessories. Quality products, 
              exceptional service, and unbeatable prices.
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@gearhub.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>1-800-GEARHUB</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>New York, NY 10001</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 GearHub. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">We accept:</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-blue-500 rounded text-xs flex items-center justify-center font-bold">
                  AMEX
                </div>
                <div className="w-8 h-5 bg-yellow-500 rounded text-xs flex items-center justify-center font-bold text-black">
                  PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}