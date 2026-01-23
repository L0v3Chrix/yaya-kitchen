'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MobileNav from './MobileNav'

const navItemsLeft = [
  { label: 'Weekly Basket', href: '#weekly-basket' },
  { label: 'The Menu', href: '#menu' },
  { label: 'Flowers', href: '#flowers' },
  { label: 'About', href: '#about' },
]

const navItemsRight = [
  { label: 'Order Now', href: '#order', primary: true },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Header - Two Tier Navigation (LPQ Style) */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-cream">
        {/* Primary Navigation */}
        <nav className="border-b border-charcoal/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-stretch justify-center">
              {/* Left Navigation Items */}
              <div className="flex items-stretch">
                {navItemsLeft.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-item flex items-center text-sm font-headline tracking-widest uppercase border-r border-purple/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Center Logo */}
              <Link
                href="/"
                className="flex flex-col items-center justify-center px-8 py-4 border-r border-charcoal/20"
              >
                <div className="relative w-32 h-16">
                  <Image
                    src="/images/brand/logo-full.png"
                    alt="YaYa's Kitchen"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-xs font-script italic text-charcoal/70 mt-1">
                  Care, Delivered Weekly
                </span>
              </Link>

              {/* Right Navigation Items */}
              <div className="flex items-stretch">
                {navItemsRight.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center text-sm font-headline tracking-widest uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                      item.primary
                        ? 'bg-gold text-charcoal px-6 py-4 border-2 border-gold hover:bg-purple hover:border-purple hover:text-green'
                        : 'nav-item'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Header - 3-Box Layout (LPQ Style) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-cream border-b border-charcoal/20">
        {/* Row 1: Logo Centered (Full Width) */}
        <div className="flex items-center justify-center py-4 border-b border-charcoal/20">
          <Link href="/" className="flex flex-col items-center">
            <div className="relative w-28 h-14">
              <Image
                src="/images/brand/logo-full.png"
                alt="YaYa's Kitchen"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xs font-script italic text-charcoal/70">
              Care, Delivered Weekly
            </span>
          </Link>
        </div>

        {/* Row 2: Hamburger LEFT | Order Now RIGHT */}
        <div className="grid grid-cols-2">
          {/* Hamburger Menu Button - LEFT Side */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center gap-2 py-3 border-r border-charcoal/20 text-sm font-headline tracking-widest uppercase"
            aria-label="Open menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Menu
          </button>

          {/* Order Now Button - RIGHT Side */}
          <Link
            href="#order"
            className="flex items-center justify-center py-3 bg-gold text-charcoal text-sm font-headline tracking-widest uppercase hover:bg-purple hover:text-green transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Order Now
          </Link>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Spacer for fixed header */}
      <div className="h-[88px] md:h-[72px]" />
    </>
  )
}
