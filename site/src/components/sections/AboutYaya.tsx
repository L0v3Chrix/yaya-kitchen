'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AboutYaya() {
  return (
    <section id="about" className="pt-20 pb-12 md:pt-32 md:pb-16 bg-[--color-cream]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative w-48 h-60 md:w-64 md:h-80 mx-auto mb-8 rounded-full overflow-hidden"
        >
          <Image
            src="/images/hero/yaya-rain-portrait.webp"
            alt="YaYa walking in the rain"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Script Label */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="font-script italic text-2xl md:text-3xl text-[--color-gold] block mb-4"
        >
          Meet YaYa
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="font-headline text-3xl md:text-4xl tracking-wide text-[--color-charcoal] mb-8"
        >
          THE HEART BEHIND THE KITCHEN
        </motion.h2>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[--color-charcoal]/80 leading-relaxed space-y-6 text-left md:text-center"
        >
          <p>
            YaYa&apos;s Kitchen is a brand that originated in 2011, built around 
            nurturing and nourishing people — not just with food, but with care, 
            warmth, and the belief that everyone deserves a moment to exhale.
          </p>
          <p>
            What started as a passion for feeding family and friends has grown 
            into a weekly practice of care for the Longwood/Altamonte community 
            and other parts of the Orlando area. Every basket is prepared with 
            the same love and attention YaYa would give to her own family.
          </p>
          <p className="font-script italic text-xl text-[--color-gold]">
            &ldquo;This isn&apos;t a business — it&apos;s a calling. Every meal is a chance 
            to show someone they matter.&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  )
}
