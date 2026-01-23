'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax effect for background image
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  // Text reveal animation variants
  const textRevealVariants = {
    hidden: { opacity: 0.3, color: '#999999' },
    visible: (i: number) => ({
      opacity: 1,
      color: '#141412',
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    }),
  }

  const goldTextVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15 + 0.2,
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    }),
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
        <Image
          src="/images/hero/hero-main-web.webp"
          alt="YaYa's Kitchen"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/70 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-2xl">
          {/* Scroll-Reveal Text (LPQ Style) */}
          <motion.div
            className="space-y-2 md:space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Line 1 */}
            <motion.h1
              custom={0}
              variants={textRevealVariants}
              className="font-headline text-4xl md:text-6xl lg:text-7xl tracking-wide"
            >
              THIS IS NOT
            </motion.h1>

            {/* Line 2 */}
            <motion.h1
              custom={1}
              variants={textRevealVariants}
              className="font-headline text-4xl md:text-6xl lg:text-7xl tracking-wide"
            >
              JUST FOOD.
            </motion.h1>

            {/* Gold Script Line */}
            <motion.p
              custom={2}
              variants={goldTextVariants}
              className="font-script italic text-3xl md:text-4xl lg:text-5xl text-gold py-2"
            >
              This is care.
            </motion.p>

            {/* Line 4 */}
            <motion.h2
              custom={3}
              variants={textRevealVariants}
              className="font-headline text-2xl md:text-4xl lg:text-5xl tracking-wide pt-4"
            >
              IT&apos;S ABOUT
            </motion.h2>

            {/* Line 5 */}
            <motion.h2
              custom={4}
              variants={textRevealVariants}
              className="font-headline text-2xl md:text-4xl lg:text-5xl tracking-wide"
            >
              SLOWING DOWN.
            </motion.h2>

            {/* Gold Script Line 2 */}
            <motion.p
              custom={5}
              variants={goldTextVariants}
              className="font-script italic text-2xl md:text-3xl lg:text-4xl text-gold py-2"
            >
              A small exhale
            </motion.p>

            {/* Line 7 */}
            <motion.h2
              custom={6}
              variants={textRevealVariants}
              className="font-headline text-2xl md:text-4xl lg:text-5xl tracking-wide"
            >
              FOR YOUR WEEK.
            </motion.h2>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-10 md:mt-14"
          >
            <Link
              href="#order"
              className="inline-block bg-gold text-charcoal font-headline text-lg tracking-widest uppercase px-8 py-4 border-2 border-gold hover:bg-purple hover:border-purple hover:text-green transition-all duration-200 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Order Your Basket
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="flex flex-col items-center text-charcoal/60"
        >
          <span className="text-xs font-headline tracking-widest uppercase mb-2">
            Scroll
          </span>
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
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
