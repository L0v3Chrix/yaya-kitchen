'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const desserts = [
  {
    src: '/images/desserts/cake-chocolate-marigold-web.webp',
    alt: 'Chocolate cake with edible marigold flowers',
    name: 'Chocolate Marigold',
  },
  {
    src: '/images/desserts/cake-rainbow.webp',
    alt: 'Colorful rainbow layer cake',
    name: 'Rainbow Cake',
  },
  {
    src: '/images/desserts/cake-red-velvet-web.webp',
    alt: 'Classic red velvet cake',
    name: 'Red Velvet',
  },
  {
    src: '/images/desserts/raspberry-pavlova.webp',
    alt: 'Raspberry pavlova with meringue',
    name: 'Raspberry Pavlova',
  },
]

export default function DessertGallery() {
  return (
    <section id="desserts" className="py-16 md:py-24 bg-[--color-cream-dark]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-script italic text-2xl text-[--color-gold] block mb-2">
            Something Sweet
          </span>
          <h2 className="font-headline text-3xl md:text-4xl tracking-wide text-[--color-charcoal]">
            TREATS & OCCASIONS
          </h2>
          <p className="text-[--color-charcoal]/70 mt-4 max-w-2xl mx-auto">
            From birthday celebrations to just-because treats, YaYa&apos;s desserts
            are made with love and perfect for any occasion.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {desserts.map((dessert, index) => (
            <motion.div
              key={dessert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut' as const,
              }}
              viewport={{ once: true, amount: 0.3 }}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden bg-[--color-cream]">
                <Image
                  src={dessert.src}
                  alt={dessert.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[--color-purple]/0 group-hover:bg-[--color-purple]/60 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-headline tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                    {dessert.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="#order"
            className="inline-block bg-[--color-gold] text-[--color-charcoal] font-headline text-sm tracking-widest uppercase px-6 py-3 hover:bg-[--color-orange] hover:text-white transition-all duration-300"
          >
            Order a Custom Cake
          </a>
        </motion.div>
      </div>
    </section>
  )
}
