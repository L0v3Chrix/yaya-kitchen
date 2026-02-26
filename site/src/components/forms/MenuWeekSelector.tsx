'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const MENU_WEEKS = [
  { 
    id: '1', 
    label: 'Week 1', 
    theme: 'Italian Night',
    image: '/images/menu/week-1.jpg',
    description: 'Fresh pasta, seasonal vegetables, homemade sauces'
  },
  { 
    id: '2', 
    label: 'Week 2', 
    theme: 'Comfort Classics',
    image: '/images/menu/week-2.jpg',
    description: 'Soul-warming favorites made from scratch'
  },
  { 
    id: '3', 
    label: 'Week 3', 
    theme: 'Global Flavors',
    image: '/images/menu/week-3.jpg',
    description: 'World cuisine adapted for family dining'
  },
  { 
    id: '4', 
    label: 'Week 4', 
    theme: 'Southern Soul',
    image: '/images/menu/week-4.jpg',
    description: 'Down-home cooking with love'
  },
] as const

interface MenuWeekSelectorProps {
  selectedWeek: string
  onWeekChange: (week: string) => void
  disabled?: boolean
}

export default function MenuWeekSelector({
  selectedWeek,
  onWeekChange,
  disabled = false,
}: MenuWeekSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block font-headline text-sm tracking-wider uppercase text-[--color-charcoal]">
        Choose Your Menu Week *
      </label>
      
      <p className="text-sm text-[--color-charcoal]/60 mb-4">
        Each week features a different theme with fresh, seasonal ingredients.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {MENU_WEEKS.map((week, index) => (
          <motion.button
            key={week.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !disabled && onWeekChange(week.id)}
            disabled={disabled}
            className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 text-left ${
              selectedWeek === week.id
                ? 'border-[--color-gold] ring-2 ring-[--color-gold]/30 shadow-md'
                : 'border-[--color-charcoal]/20 hover:border-[--color-gold]/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Image */}
            <div className="relative h-24 sm:h-32 bg-[--color-cream]">
              <Image
                src={week.image}
                alt={`${week.label} - ${week.theme}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 200px"
              />
              
              {/* Selected Overlay */}
              {selectedWeek === week.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[--color-gold]/20 flex items-center justify-center"
                >
                  <div className="w-8 h-8 bg-[--color-gold] rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="font-headline text-xs tracking-wider text-[--color-charcoal]">
                  {week.label}
                </span>
                {selectedWeek === week.id && (
                  <span className="text-[10px] font-headline tracking-wider text-[--color-gold] uppercase">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-[--color-purple]">
                {week.theme}
              </p>
              <p className="text-xs text-[--color-charcoal]/60 mt-1 line-clamp-2">
                {week.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Hint */}
      <p className="text-xs text-[--color-charcoal]/50 flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Tap a menu card to view full menu details
      </p>
    </div>
  )
}
