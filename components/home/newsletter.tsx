'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Gift } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Welcome to our newsletter! 🎉",
        description: "You'll receive exclusive offers and updates.",
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-blue-600 dark:bg-blue-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-white" />
              <Gift className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get Exclusive Deals & Updates
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, 
            special offers, and exclusive discounts. Plus, get 10% off your first order!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white border-white text-gray-900 placeholder:text-gray-500"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>

          <p className="text-sm text-blue-100 mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}