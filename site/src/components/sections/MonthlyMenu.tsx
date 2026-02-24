'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const weeks = [
  { id: 1, label: 'Week 1', theme: 'Italian Night', image: '/images/menu/week-1.jpg' },
  { id: 2, label: 'Week 2', theme: 'Comfort Classics', image: '/images/menu/week-2.jpg' },
  { id: 3, label: 'Week 3', theme: 'Global Flavors', image: '/images/menu/week-3.jpg' },
  { id: 4, label: 'Week 4', theme: 'Southern Soul', image: '/images/menu/week-4.jpg' },
]

export default function MonthlyMenu() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  const openLightbox = (weekId: number) => {
    setSelectedWeek(weekId)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedWeek(null)
    document.body.style.overflow = 'unset'
  }

  const selectedImage = weeks.find(w => w.id === selectedWeek)

  return (
    <>
      <section id="menu" className="pt-8 pb-16 md:pt-12 md:pb-24 bg-[--color-purple]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-14"
          >
            <span className="font-script italic text-xl md:text-2xl text-[--color-gold] block mb-3">
              What&apos;s Cooking
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl tracking-wide text-[--color-charcoal] mb-5">
              YAYA&apos;S KITCHEN — MONTH 1
            </h2>
            <div className="max-w-xl mx-auto space-y-1">
              <p className="text-[--color-charcoal]/80 text-sm md:text-base">
                Portions sized for 2 adults + 2 children
              </p>
              <p className="text-[--color-gold] font-medium text-sm md:text-base">
                Add +$15 to increase portions for older kids or up to 4 adults
              </p>
            </div>
          </motion.div>

          {/* Weekly Menu Grid */}
          {/* Mobile: Single column for readability */}
          {/* Tablet: 2 columns */}
          {/* Desktop: 2x2 grid with larger images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {weeks.map((week, index) => (
              <motion.button
                key={week.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => openLightbox(week.id)}
                className="relative aspect-square bg-[--color-cream] rounded-lg overflow-hidden group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[--color-gold] focus:ring-offset-2 focus:ring-offset-[--color-purple] shadow-lg hover:shadow-xl transition-shadow duration-300"
                aria-label={`View ${week.label} menu - ${week.theme}. Tap to enlarge.`}
              >
                <Image
                  src={week.image}
                  alt={`YaYa's Kitchen ${week.label} Menu - ${week.theme}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 512px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  priority={index < 2}
                />
                
                {/* Tap to enlarge hint - mobile only */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Tap to enlarge
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 md:mt-14"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-[--color-gold]/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedWeek !== null && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedImage.label} menu enlarged view`}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close enlarged view"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation arrows for desktop */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                const prevId = selectedWeek === 1 ? 4 : selectedWeek - 1
                setSelectedWeek(prevId)
              }}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous week"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                const nextId = selectedWeek === 4 ? 1 : selectedWeek + 1
                setSelectedWeek(nextId)
              }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next week"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Enlarged image */}
            <motion.div
              key={selectedWeek}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.image}
                alt={`YaYa's Kitchen ${selectedImage.label} Menu - ${selectedImage.theme}`}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Week indicator dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {weeks.map((week) => (
                <button
                  key={week.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedWeek(week.id)
                  }}
                  className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                    week.id === selectedWeek ? 'bg-[--color-gold]' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`View ${week.label}`}
                  aria-current={week.id === selectedWeek ? 'true' : 'false'}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
