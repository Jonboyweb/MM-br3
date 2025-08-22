'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/thebackroomleeds',
      icon: Instagram,
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/thebackroomleeds',
      icon: Facebook,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/thebackroomleeds',
      icon: Twitter,
    },
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Private Hire', href: '/private-hire' },
    { name: 'Bottle Service', href: '/bottle-service' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const openingHours = [
    { day: 'Friday', time: '11pm - 6am', event: 'La Fiesta' },
    { day: 'Saturday', time: '11pm - 6am', event: 'Shhh!' },
    { day: 'Sunday', time: '11pm - 5am', event: 'Nostalgia' },
  ];

  return (
    <footer className="bg-speakeasy-black text-content-secondary">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-deco-gold font-headline text-xl mb-4">CONTACT</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-deco-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">50a Call Lane</p>
                    <p>Leeds LS1 6DT</p>
                    <p className="text-content-tertiary text-sm mt-1">
                      (Hidden under the railway bridge)
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-deco-gold" />
                  <a 
                    href="tel:01131234567" 
                    className="hover:text-deco-gold transition-colors focus-accessible"
                  >
                    0113 123 4567
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-deco-gold" />
                  <a 
                    href="mailto:info@thebackroomleeds.com" 
                    className="hover:text-deco-gold transition-colors focus-accessible"
                  >
                    info@thebackroomleeds.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-6">
            <div>
              <h3 className="text-deco-gold font-headline text-xl mb-4">OPENING HOURS</h3>
              <div className="space-y-3">
                {openingHours.map((slot, index) => (
                  <div key={index} className="border-l-2 border-deco-gold pl-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-deco-gold" />
                      <span className="font-medium">{slot.day}</span>
                    </div>
                    <p className="text-sm text-content-tertiary">{slot.time}</p>
                    <p className="text-xs text-deco-champagne">{slot.event}</p>
                  </div>
                ))}
                <div className="text-sm text-content-tertiary pt-2">
                  <p>Monday - Thursday: Closed</p>
                  <p className="text-xs text-prohibition-wine">
                    Available for private hire
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div>
              <h3 className="text-deco-gold font-headline text-xl mb-4">QUICK LINKS</h3>
              <nav className="space-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block hover:text-deco-gold transition-colors focus-accessible"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-deco-gold font-headline text-xl mb-4">FOLLOW US</h3>
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-speakeasy-charcoal border border-deco-gold rounded-lg flex items-center justify-center hover:bg-deco-gold hover:text-speakeasy-black transition-all duration-300 focus-accessible"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
              
              {/* Newsletter signup */}
              <div className="bg-speakeasy-charcoal rounded-lg p-4 border border-speakeasy-ash">
                <h4 className="text-deco-champagne font-medium mb-2">Get Event Updates</h4>
                <p className="text-xs text-content-tertiary mb-3">
                  Be the first to know about special events and VIP offers
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="flex-1 bg-speakeasy-smoke border border-speakeasy-ash rounded-l-md px-3 py-2 text-sm text-content-primary placeholder:text-content-tertiary focus:border-deco-gold focus:outline-none"
                  />
                  <button className="bg-deco-gold text-speakeasy-black px-4 py-2 rounded-r-md text-sm font-medium hover:bg-deco-champagne transition-colors focus-accessible">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-speakeasy-ash bg-speakeasy-charcoal">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-content-tertiary">
              <p>&copy; 2025 The Backroom Leeds. All rights reserved.</p>
              <p className="text-xs mt-1">
                Licensed venue • Age 18+ only • Please drink responsibly
              </p>
            </div>

            {/* Legal Links */}
            <nav className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-content-tertiary hover:text-deco-gold transition-colors focus-accessible"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Art Deco decorative element */}
      <div className="h-1 bg-gradient-to-r from-transparent via-deco-gold to-transparent"></div>
    </footer>
  );
}