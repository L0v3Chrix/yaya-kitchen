'use client'

import { motion } from 'framer-motion'
import { useMemo, useEffect } from 'react'

type DeliveryMode = 'single' | 'multi' | 'every'

interface DeliveryWeek {
  value: string
  label: string
  shortLabel: string
}

interface DeliveryWeekSelectorProps {
  selectedWeeks: string[]
  onWeeksChange: (weeks: string[]) => void
  mode: DeliveryMode
  onModeChange: (mode: DeliveryMode) => void
  disabled?: boolean
}

/**
 * Get the next 4 Fridays from today
 */
function getNextFourFridays(): DeliveryWeek[] {
  const fridays: DeliveryWeek[] = []
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  let daysUntilFriday = (5 - dayOfWeek + 7) % 7
  if (daysUntilFriday === 0) {
    daysUntilFriday = 7
  }
  
  for (let i = 0; i < 4; i++) {
    const friday = new Date(today)
    friday.setDate(today.getDate() + daysUntilFriday + (i * 7))
    
    const label = friday.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
    
    const shortLabel = friday.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
    
    fridays.push({
      value: friday.toISOString().split('T')[0],
      label,
      shortLabel
    })
  }
  
  return fridays
}

export default function DeliveryWeekSelector({
  selectedWeeks,
  onWeeksChange,
  mode,
  onModeChange,
  disabled = false,
}: DeliveryWeekSelectorProps) {
  const deliveryWeeks = useMemo(() => getNextFourFridays(), [])

  // Auto-select first week on mount if nothing selected
  // Use a ref to ensure this only fires once
  useEffect(() => {
    if (selectedWeeks.length === 0 && deliveryWeeks.length > 0) {
      // Immediate call to ensure selection
      onWeeksChange([deliveryWeeks[0].value])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleModeChange = (newMode: DeliveryMode) => {
    if (disabled) return
    onModeChange(newMode)
    
    if (newMode === 'every') {
      // Select all weeks
      onWeeksChange(deliveryWeeks.map(w => w.value))
    } else if (newMode === 'single' && selectedWeeks.length > 1) {
      // Keep only first selected week
      onWeeksChange([selectedWeeks[0] || deliveryWeeks[0].value])
    } else if (newMode === 'single' && selectedWeeks.length === 0) {
      // Select first week by default
      onWeeksChange([deliveryWeeks[0].value])
    }
  }

  const handleWeekToggle = (weekValue: string) => {
    if (disabled) return
    
    if (mode === 'single') {
      // Single mode: replace selection
      onWeeksChange([weekValue])
    } else {
      // Multi mode: toggle
      if (selectedWeeks.includes(weekValue)) {
        const newWeeks = selectedWeeks.filter(w => w !== weekValue)
        // Don't allow empty selection
        if (newWeeks.length > 0) {
          onWeeksChange(newWeeks)
        }
      } else {
        onWeeksChange([...selectedWeeks, weekValue])
      }
      
      // If all weeks selected, switch to "every" mode
      if (selectedWeeks.length === 3 && !selectedWeeks.includes(weekValue)) {
        onModeChange('every')
      }
    }
  }

  const isWeekSelected = (weekValue: string) => selectedWeeks.includes(weekValue)

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div>
        <label className="block font-headline text-sm tracking-wider uppercase text-[--color-charcoal] mb-3">
          How Often Would You Like Delivery?
        </label>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleModeChange('single')}
            disabled={disabled}
            className={`p-3 border-2 text-center transition-all duration-200 ${
              mode === 'single'
                ? 'border-[--color-gold] bg-[--color-gold]/10 ring-2 ring-[--color-gold]/30'
                : 'border-[--color-charcoal]/20 hover:border-[--color-gold]/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="block font-headline text-sm tracking-wider">One Week</span>
            <span className="text-xs text-[--color-charcoal]/60">This time only</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleModeChange('multi')}
            disabled={disabled}
            className={`p-3 border-2 text-center transition-all duration-200 ${
              mode === 'multi'
                ? 'border-[--color-gold] bg-[--color-gold]/10 ring-2 ring-[--color-gold]/30'
                : 'border-[--color-charcoal]/20 hover:border-[--color-gold]/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="block font-headline text-sm tracking-wider">Multi-Week</span>
            <span className="text-xs text-[--color-charcoal]/60">Pick your weeks</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleModeChange('every')}
            disabled={disabled}
            className={`p-3 border-2 text-center transition-all duration-200 relative overflow-hidden ${
              mode === 'every'
                ? 'border-[--color-green] bg-[--color-green]/10 ring-2 ring-[--color-green]/30'
                : 'border-[--color-charcoal]/20 hover:border-[--color-green]/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="absolute -top-1 -right-1 bg-[--color-green] text-white text-[10px] font-headline px-2 py-0.5 rotate-12">
              SAVE 15%
            </span>
            <span className="block font-headline text-sm tracking-wider text-[--color-green]">Every Week</span>
            <span className="text-xs text-[--color-charcoal]/60">Auto-delivery</span>
          </button>
        </div>
      </div>

      {/* Week Cards */}
      <div>
        <label className="block font-headline text-sm tracking-wider uppercase text-[--color-charcoal] mb-3">
          {mode === 'single' ? 'Select Your Delivery Friday' : 
           mode === 'multi' ? 'Select Your Delivery Fridays' : 
           'Your Weekly Deliveries'}
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {deliveryWeeks.map((week, index) => {
            const isSelected = isWeekSelected(week.value)
            const isEveryMode = mode === 'every'
            
            return (
              <motion.button
                key={week.value}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !isEveryMode && handleWeekToggle(week.value)}
                disabled={disabled || isEveryMode}
                className={`relative p-4 border-3 text-center transition-all duration-200 ${
                  isSelected
                    ? isEveryMode 
                      ? 'border-[--color-green] bg-[--color-green]/20 shadow-lg'
                      : 'border-[--color-gold] bg-[--color-gold]/30 shadow-lg ring-4 ring-[--color-gold]/40'
                    : 'border-[--color-charcoal]/20 hover:border-[--color-gold]/50 bg-white'
                } ${disabled || isEveryMode ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {/* Week number */}
                <span className={`block text-xs font-headline tracking-wider mb-1 ${
                  isSelected ? 'text-[--color-charcoal] font-bold' : 'text-[--color-charcoal]/50'
                }`}>
                  WEEK {index + 1}
                </span>
                
                {/* Date */}
                <span className={`block font-bold text-lg ${
                  isSelected ? 'text-[--color-purple]' : 'text-[--color-charcoal]'
                }`}>
                  {week.shortLabel}
                </span>
                
                {/* Checkmark for selected - larger and more prominent */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md ${
                      isEveryMode ? 'bg-[--color-green]' : 'bg-[--color-gold]'
                    }`}
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
                
                {/* Selected label */}
                {isSelected && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`block text-xs font-headline tracking-wider mt-2 ${
                      isEveryMode ? 'text-[--color-green]' : 'text-[--color-gold]'
                    }`}
                  >
                    SELECTED
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Contextual Messages */}
      {mode === 'every' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-[--color-green]/10 border-l-4 border-[--color-green]"
        >
          <p className="text-[--color-green] font-medium">
            🎉 You're getting the weekly subscription rate!
          </p>
          <p className="text-sm text-[--color-charcoal]/70 mt-1">
            15% off every basket. You can pause or skip anytime by texting YaYa.
          </p>
        </motion.div>
      )}

      {mode === 'multi' && selectedWeeks.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-[--color-gold]/10 border-l-4 border-[--color-gold]"
        >
          <p className="text-[--color-charcoal] font-medium">
            {selectedWeeks.length} weeks selected
          </p>
          <p className="text-sm text-[--color-charcoal]/70 mt-1">
            One order, {selectedWeeks.length} deliveries. We'll deliver each Friday you selected.
          </p>
        </motion.div>
      )}

      {/* Cutoff Reminder */}
      <div className="flex items-start gap-2 text-sm text-[--color-charcoal]/60">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span>Order by <strong>Tuesday 9am</strong> for that week's Friday delivery (9am–11am).</span>
      </div>
    </div>
  )
}
