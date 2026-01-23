'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface SplitSectionProps {
  id?: string
  imagePosition: 'left' | 'right'
  image: {
    src: string
    alt: string
  }
  scriptLabel?: string
  headline: string
  content: ReactNode
  cta?: {
    text: string
    href: string
  }
  backgroundColor?: 'cream' | 'cream-dark' | 'white'
}

export default function SplitSection({
  id,
  imagePosition,
  image,
  scriptLabel,
  headline,
  content,
  cta,
  backgroundColor = 'cream',
}: SplitSectionProps) {
  const bgColorClass = {
    cream: 'bg-[--color-cream]',
    'cream-dark': 'bg-[--color-cream-dark]',
    white: 'bg-white',
  }[backgroundColor]

  return (
    <section id={id} className={`py-16 md:py-24 ${bgColorClass}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`split-section items-center ${
            imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: imagePosition === 'left' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
            viewport={{ once: true, amount: 0.3 }}
            className={`image-hover ${
              imagePosition === 'left' ? 'md:order-1' : 'md:order-2'
            }`}
          >
            <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
            viewport={{ once: true, amount: 0.3 }}
            className={`flex flex-col justify-center ${
              imagePosition === 'left' ? 'md:order-2 md:pl-8' : 'md:order-1 md:pr-8'
            }`}
          >
            {/* Script Label */}
            {scriptLabel && (
              <span className="font-script italic text-xl md:text-2xl text-[--color-gold] mb-2">
                {scriptLabel}
              </span>
            )}

            {/* Headline */}
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl tracking-wide text-[--color-charcoal] mb-6">
              {headline}
            </h2>

            {/* Content */}
            <div className="text-[--color-charcoal]/80 leading-relaxed space-y-4">
              {content}
            </div>

            {/* CTA Button */}
            {cta && (
              <div className="mt-8">
                <Link
                  href={cta.href}
                  className="inline-block bg-[--color-gold] text-[--color-charcoal] font-headline text-sm tracking-widest uppercase px-6 py-3 hover:bg-[--color-orange] hover:text-white transition-all duration-300"
                >
                  {cta.text}
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
