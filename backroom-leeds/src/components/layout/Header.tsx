'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, MapPin } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Book Table', href: '/booking' },
    { name: 'Private Hire', href: '/private-hire' },
    { name: 'Bottle Service', href: '/bottle-service' },
  ];

  return (
    <header className="bg-speakeasy-black border-b border-deco-gold relative z-fixed">
      {/* Top bar with contact info */}
      <div className="bg-speakeasy-charcoal text-content-secondary text-sm py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>50a Call Lane, Leeds LS1 6DT</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>0113 123 4567</span>
              </div>
            </div>
            <div className="text-deco-gold font-medium">
              18+ Only • Late License Until 6am
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-deco-gold text-3xl font-headline group-hover:text-deco-champagne transition-colors">
              THE BACKROOM
            </div>
            <div className="hidden sm:block text-content-tertiary text-sm font-script">
              Leeds&apos; Hidden Speakeasy
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-content-secondary hover:text-deco-gold transition-colors font-medium focus-accessible"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/booking"
              className="cta-gold rounded-lg font-headline text-sm focus-accessible"
            >
              BOOK NOW
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-content-secondary hover:text-deco-gold transition-colors focus-accessible"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-speakeasy-charcoal border-t border-speakeasy-ash">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-content-secondary hover:text-deco-gold transition-colors font-medium py-2 focus-accessible"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-speakeasy-ash">
                <Link
                  href="/booking"
                  onClick={() => setIsMenuOpen(false)}
                  className="cta-primary w-full text-center rounded-lg font-headline text-sm focus-accessible block"
                >
                  BOOK YOUR TABLE
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}