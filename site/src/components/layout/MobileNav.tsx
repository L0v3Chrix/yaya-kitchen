'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { label: 'Weekly Basket', href: '#weekly-basket' },
  { label: 'The Menu', href: '#menu' },
  { label: 'Flowers & Treats', href: '#flowers' },
  { label: 'Arrival Baskets', href: '#arrival' },
  { label: 'About YaYa', href: '#about' },
  { label: 'Order Now', href: '#order', primary: true },
]

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-charcoal/50 z-50"
            onClick={onClose}
          />

          {/* Drawer - Opens from LEFT (per LPQ pattern) */}
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-cream z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-charcoal/20">
              <span className="font-headline text-lg tracking-widest uppercase">
                Menu
              </span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 hover:bg-charcoal/10 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block px-6 py-4 text-lg font-headline tracking-wider uppercase transition-colors ${
                      item.primary
                        ? 'bg-gold text-charcoal hover:bg-orange hover:text-white mt-4 mx-4 text-center'
                        : 'hover:bg-charcoal/5 border-b border-charcoal/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-charcoal/20">
              <p className="text-sm font-script italic text-charcoal/60 text-center">
                Care, Delivered Weekly
              </p>
              <p className="text-xs text-charcoal/40 text-center mt-2">
                Wilmington, NC
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
