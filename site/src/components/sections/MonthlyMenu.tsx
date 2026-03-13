'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// ─────────────────────────────────────────────
// MENU DATA — update each month here
// To add May: add a new entry to MONTHS array,
// set image paths, and remove the oldest month.
// ─────────────────────────────────────────────

type Week = {
  id: number
  label: string
  date: string
  image: string
  alt: string
}

type Month = {
  label: string
  weeks: Week[]
}

const MONTHS: Month[] = [
  {
    label: 'March',
    weeks: [
      { id: 1, label: 'Week 1', date: 'Friday, March 6',  image: '/images/menu/week-1.jpg', alt: "YaYa's Kitchen March Week 1 Menu" },
      { id: 2, label: 'Week 2', date: 'Friday, March 13', image: '/images/menu/week-2.jpg', alt: "YaYa's Kitchen March Week 2 Menu" },
      { id: 3, label: 'Week 3', date: 'Friday, March 20', image: '/images/menu/week-3.jpg', alt: "YaYa's Kitchen March Week 3 Menu" },
      { id: 4, label: 'Week 4', date: 'Friday, March 27', image: '/images/menu/week-4.jpg', alt: "YaYa's Kitchen March Week 4 Menu" },
    ],
  },
  {
    label: 'April',
    weeks: [
      { id: 1, label: 'Week 1', date: 'Friday, April 3',  image: '/images/menu/april-week-1.jpg', alt: "YaYa's Kitchen April Week 1 — Salmon Spring Bowl" },
      { id: 2, label: 'Week 2', date: 'Friday, April 10', image: '/images/menu/april-week-2.jpg', alt: "YaYa's Kitchen April Week 2 — Beef & Broccoli Bowl" },
      { id: 3, label: 'Week 3', date: 'Friday, April 17', image: '/images/menu/april-week-3.jpg', alt: "YaYa's Kitchen April Week 3 — Mexican Street Bowl" },
      { id: 4, label: 'Week 4', date: 'Friday, April 24', image: '/images/menu/april-week-4.jpg', alt: "YaYa's Kitchen April Week 4 — Teriyaki Chicken Bowl" },
    ],
  },
]

export default function MonthlyMenu() {
  const [activeMonth, setActiveMonth] = useState(MONTHS.length - 1) // default to latest month
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  const month = MONTHS[activeMonth]
  const selectedImage = month.weeks.find(w => w.id === selectedWeek)

  const openLightbox = (weekId: number) => {
    setSelectedWeek(weekId)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedWeek(null)
    document.body.style.overflow = 'unset'
  }

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
            className="text-center mb-8 md:mb-12"
          >
            <span className="font-script italic text-xl md:text-2xl text-[--color-gold] block mb-3">
              What&apos;s Cooking
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl tracking-wide text-white mb-3">
              YAYA&apos;S KITCHEN MENU
            </h2>
            <p className="text-white/60 text-sm">
              Portions sized for 2 adults + 2 children &bull; +$15 to increase portions
            </p>
          </motion.div>

          {/* Month Tabs */}
          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {MONTHS.map((m, idx) => (
              <button
                key={m.label}
                onClick={() => { setActiveMonth(idx); setSelectedWeek(null) }}
                className={`font-headline text-sm tracking-widest uppercase px-6 py-2 border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-gold] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-purple] ${
                  activeMonth === idx
                    ? 'bg-[--color-gold] border-[--color-gold] text-[--color-charcoal]'
                    : 'bg-transparent border-white/30 text-white/60 hover:border-[--color-gold] hover:text-[--color-gold]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Week Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMonth}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6"
            >
              {month.weeks.map((week, index) => (
                <motion.button
                  key={week.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  onClick={() => openLightbox(week.id)}
                  className="relative aspect-square bg-[--color-cream] rounded-lg overflow-hidden group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[--color-gold] focus:ring-offset-2 focus:ring-offset-[--color-purple] shadow-lg hover:shadow-xl transition-shadow duration-300"
                  aria-label={`View ${week.label} menu — ${week.date}. Tap to enlarge.`}
                >
                  <Image
                    src={week.image}
                    alt={week.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 512px"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    priority={index < 2}
                  />
                  {/* Date badge */}
                  <div className="absolute top-3 left-3 bg-[--color-purple]/90 text-white text-xs font-headline tracking-wide px-3 py-1 rounded">
                    {week.date}
                  </div>
                  {/* Tap hint */}
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
            </motion.div>
          </AnimatePresence>

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
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); const weeks = month.weeks; const cur = weeks.findIndex(w => w.id === selectedWeek); setSelectedWeek(weeks[(cur - 1 + weeks.length) % weeks.length].id) }}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous week"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); const weeks = month.weeks; const cur = weeks.findIndex(w => w.id === selectedWeek); setSelectedWeek(weeks[(cur + 1) % weeks.length].id) }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next week"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

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
                alt={selectedImage.alt}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {month.weeks.map((week) => (
                <button
                  key={week.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedWeek(week.id) }}
                  className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${week.id === selectedWeek ? 'bg-[--color-gold]' : 'bg-white/40 hover:bg-white/60'}`}
                  aria-label={`View ${week.label}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
