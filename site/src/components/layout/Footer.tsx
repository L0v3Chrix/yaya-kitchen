import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-cream-dark border-t-4 border-purple">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-40 h-20 mb-2">
            <Image
              src="/images/brand/logo-full.png"
              alt="YaYa's Kitchen"
              fill
              className="object-contain"
            />
          </div>
          <p className="font-script italic text-lg text-charcoal/70">
            Care, Delivered Weekly
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8">
          <Link
            href="#weekly-basket"
            className="text-sm font-headline tracking-wider uppercase text-charcoal/70 hover:text-gold transition-colors"
          >
            Weekly Basket
          </Link>
          <Link
            href="#menu"
            className="text-sm font-headline tracking-wider uppercase text-charcoal/70 hover:text-gold transition-colors"
          >
            The Menu
          </Link>
          <Link
            href="#flowers"
            className="text-sm font-headline tracking-wider uppercase text-charcoal/70 hover:text-gold transition-colors"
          >
            Flowers
          </Link>
          <Link
            href="#about"
            className="text-sm font-headline tracking-wider uppercase text-charcoal/70 hover:text-gold transition-colors"
          >
            About
          </Link>
          <Link
            href="#order"
            className="text-sm font-headline tracking-wider uppercase text-gold hover:text-orange transition-colors"
          >
            Order Now
          </Link>
        </nav>

        {/* Contact Information */}
        <div className="text-center mb-8">
          <p className="text-sm text-charcoal/60 mb-1">
            Serving Wilmington, NC and surrounding areas
          </p>
          <a
            href="mailto:hello@yayaskitchen.com"
            className="text-sm text-purple hover:text-gold transition-colors"
          >
            hello@yayaskitchen.com
          </a>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-charcoal/20 mx-auto mb-8" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-charcoal/50">
            &copy; {new Date().getFullYear()} YaYa&apos;s Kitchen. All rights reserved.
          </p>
          <p className="text-xs text-charcoal/40 mt-2 font-script italic">
            Made with love in Wilmington
          </p>
        </div>
      </div>
    </footer>
  )
}
