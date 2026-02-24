'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ZIP codes with free delivery (8-mile radius from 32779 Longwood)
const FREE_DELIVERY_ZIPS = ['32779', '32750', '32714', '32701', '32746', '32703', '32791', '32708']

type ContactPreference = 'Text' | 'Email' | 'Both'

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  zipCode: string
  deliveryWeek: string
  deliveryInstructions: string
  contactPreference: ContactPreference | ''
  weeklyBasket: 'Yes' | 'No'
  giftBasket: 'Yes' | 'No'
  giftBasketRecipient: string
  giftMessage: string
  dinnerAnchor: 'None' | 'Add-On' | 'Bundle'
  smoothieQty: '0' | '1' | '2' | '3'
  dessert: boolean
  flowersHome: 'None' | '1 arrangement' | '2-3 arrangements'
  flowersGift: boolean
  giftRecipient: string
  arrivalBasket: boolean
  pantryStarter: boolean
  deliveryDay: 'Friday' | 'Other'
  containerDeposit: boolean
  subscriptionInterest: boolean
  specialNotes: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Get the next 4 Fridays from today
 * Returns array of { value: ISO date string, label: "Friday, Feb 28" }
 */
function getNextFourFridays(): Array<{ value: string; label: string }> {
  const fridays: Array<{ value: string; label: string }> = []
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  // Calculate days until next Friday (Friday = 5)
  let daysUntilFriday = (5 - dayOfWeek + 7) % 7
  if (daysUntilFriday === 0) {
    // If today is Friday, check if it's before 9am Tuesday cutoff
    // For simplicity, always start from next Friday if today is Friday
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
    
    fridays.push({
      value: friday.toISOString().split('T')[0],
      label
    })
  }
  
  return fridays
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  zipCode: '',
  deliveryWeek: '',
  deliveryInstructions: '',
  contactPreference: '',
  weeklyBasket: 'Yes',
  giftBasket: 'No',
  giftBasketRecipient: '',
  giftMessage: '',
  dinnerAnchor: 'None',
  smoothieQty: '0',
  dessert: false,
  flowersHome: 'None',
  flowersGift: false,
  giftRecipient: '',
  arrivalBasket: false,
  pantryStarter: false,
  deliveryDay: 'Friday',
  containerDeposit: false,
  subscriptionInterest: false,
  specialNotes: '',
}

// Will be replaced with actual Google Apps Script URL
const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || ''

export default function OrderForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // Compute delivery weeks once
  const deliveryWeeks = useMemo(() => getNextFourFridays(), [])

  // Set default delivery week on first render
  useState(() => {
    if (deliveryWeeks.length > 0 && !formData.deliveryWeek) {
      setFormData(prev => ({ ...prev, deliveryWeek: deliveryWeeks[0].value }))
    }
  })

  // Check if ZIP is in free delivery zone
  const isZipInZone = FREE_DELIVERY_ZIPS.includes(formData.zipCode.trim())
  const showDeliveryFeeWarning = formData.zipCode.trim().length === 5 && !isZipInZone

  // Check if gift message should be shown
  const showGiftMessage = formData.giftBasket === 'Yes' || formData.flowersGift

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (formData.name.length < 2) {
      newErrors.name = 'Please enter your full name'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number'
    }
    if (formData.address.length < 10) {
      newErrors.address = 'Please enter your full delivery address'
    }
    if (!/^\d{5}$/.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code'
    }
    if (!formData.deliveryWeek) {
      newErrors.deliveryWeek = 'Please select a delivery week'
    }
    if (!formData.contactPreference) {
      newErrors.contactPreference = 'Please select how you\'d like us to contact you'
    }
    if (formData.giftBasket === 'Yes' && formData.giftBasketRecipient.length < 10) {
      newErrors.giftBasketRecipient = 'Please enter the recipient\'s name and delivery address'
    }
    if (!formData.containerDeposit) {
      newErrors.containerDeposit = 'Please acknowledge the container deposit'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setStatus('submitting')

    try {
      // Validate that Google Script URL is configured
      if (!GOOGLE_SCRIPT_URL) {
        console.error('Order form: GOOGLE_SCRIPT_URL not configured')
        setStatus('error')
        return
      }

      // Format delivery week label for submission
      const selectedWeek = deliveryWeeks.find(w => w.value === formData.deliveryWeek)
      
      // Prepare data for submission with timestamp
      const submitData = {
        ...formData,
        deliveryWeekLabel: selectedWeek?.label || formData.deliveryWeek,
        isInDeliveryZone: isZipInZone ? 'Yes' : 'No',
        deliveryFee: isZipInZone ? '$0' : '$10',
        dessert: formData.dessert ? 'Yes' : 'No',
        flowersGift: formData.flowersGift ? 'Yes' : 'No',
        arrivalBasket: formData.arrivalBasket ? 'Yes' : 'No',
        pantryStarter: formData.pantryStarter ? 'Yes' : 'No',
        containerDeposit: formData.containerDeposit ? 'Yes' : 'No',
        subscriptionInterest: formData.subscriptionInterest ? 'Yes' : 'No',
        submittedAt: new Date().toISOString(),
      }

      // Submit to Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      // no-cors returns opaque response, but if we got here without throwing, 
      // the request was sent. Network errors will throw.
      // Note: This doesn't guarantee the sheet received it, but confirms network delivery.
      if (response.type === 'opaque' || response.ok) {
        setStatus('success')
        setFormData(initialFormData)
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error('Order submission failed:', err)
      setStatus('error')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const inputClasses = (fieldName: keyof FormData) =>
    `w-full px-4 py-3 border-2 ${
      errors[fieldName]
        ? 'border-red-400 bg-red-50'
        : 'border-[--color-charcoal]/20 focus:border-[--color-gold]'
    } bg-white focus:outline-none transition-colors`

  const labelClasses = 'block font-headline text-sm tracking-wider uppercase text-[--color-charcoal] mb-2'

  const sectionClasses = 'mb-10 pb-10 border-b border-[--color-charcoal]/10'

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-[--color-green] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-headline text-2xl tracking-wide text-[--color-charcoal] mb-4">
          ORDER RECEIVED!
        </h3>
        <p className="text-[--color-charcoal]/70 mb-6">
          Thank you! Your order has been received. We&apos;ll be in touch soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-[--color-purple] hover:text-[--color-green] font-headline tracking-wider uppercase text-sm px-4 py-2 border-2 border-[--color-purple] hover:bg-[--color-purple] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-purple] focus-visible:ring-offset-2"
        >
          Place Another Order
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Error Banner */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-6 mb-8 text-center"
          >
            <p className="font-headline text-lg mb-2">Uh oh, looks like there&apos;s a problem!</p>
            <p className="mb-3">Please text YaYa directly so we can help you out:</p>
            <a 
              href="sms:3039106971" 
              className="inline-block bg-[--color-purple] text-white font-headline tracking-wider px-6 py-3 hover:bg-[--color-green] transition-colors"
            >
              Text YaYa: (303) 910-6971
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 1: Contact Information */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            1
          </span>
          CONTACT INFORMATION
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClasses}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClasses('name')}
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className={labelClasses}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses('email')}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="phone" className={labelClasses}>
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses('phone')}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Contact Preference */}
        <div className="mt-4">
          <label className={labelClasses}>
            Preferred Contact Method *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Text', 'Email', 'Both'] as const).map((option) => (
              <label
                key={option}
                className={`flex items-center justify-center gap-2 p-3 border-2 cursor-pointer transition-colors ${
                  formData.contactPreference === option
                    ? 'border-[--color-gold] bg-[--color-gold]/10'
                    : errors.contactPreference
                    ? 'border-red-400 bg-red-50'
                    : 'border-[--color-charcoal]/20 hover:border-[--color-gold]'
                }`}
              >
                <input
                  type="radio"
                  name="contactPreference"
                  value={option}
                  checked={formData.contactPreference === option}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[--color-gold]"
                />
                <span className="font-headline text-sm tracking-wider">{option}</span>
              </label>
            ))}
          </div>
          {errors.contactPreference && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPreference}</p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="address" className={labelClasses}>
            Delivery Address *
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className={inputClasses('address')}
            placeholder="Street address, city"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        {/* ZIP Code */}
        <div className="mt-4">
          <label htmlFor="zipCode" className={labelClasses}>
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            maxLength={5}
            className={`${inputClasses('zipCode')} max-w-[150px]`}
            placeholder="32779"
          />
          {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
          
          {/* Out of zone delivery fee notice */}
          <AnimatePresence>
            {showDeliveryFeeWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-800"
              >
                <p className="text-sm font-medium">
                  +$10 delivery fee applies to your area
                </p>
                <p className="text-xs mt-1 text-amber-700">
                  We deliver! Your ZIP is outside our free delivery zone.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* In zone confirmation */}
          <AnimatePresence>
            {formData.zipCode.trim().length === 5 && isZipInZone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-sm text-[--color-green] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free delivery to your area!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Delivery Instructions */}
        <div className="mt-4">
          <label htmlFor="deliveryInstructions" className={labelClasses}>
            Delivery Instructions
          </label>
          <textarea
            id="deliveryInstructions"
            name="deliveryInstructions"
            value={formData.deliveryInstructions}
            onChange={handleChange}
            rows={2}
            className={inputClasses('deliveryInstructions')}
            placeholder="Gate codes, door codes, leave at door, or place in refrigerator..."
          />
          <p className="text-sm text-[--color-charcoal]/60 mt-1">
            Optional — help us deliver smoothly
          </p>
        </div>
      </div>

      {/* Section 2: Delivery Week */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            2
          </span>
          DELIVERY WEEK
        </h3>

        <div className="bg-[--color-gold]/10 p-4 mb-6 border-l-4 border-[--color-gold]">
          <p className="text-[--color-charcoal] font-medium">
            Order by Tuesday 9am for Friday delivery
          </p>
          <p className="text-sm text-[--color-charcoal]/70 mt-1">
            Baskets are delivered each Friday between 9am–11am.
          </p>
        </div>

        <label htmlFor="deliveryWeek" className={labelClasses}>
          Select Delivery Friday *
        </label>
        <select
          id="deliveryWeek"
          name="deliveryWeek"
          value={formData.deliveryWeek}
          onChange={handleChange}
          className={`${inputClasses('deliveryWeek')} cursor-pointer`}
        >
          <option value="">Choose a delivery date...</option>
          {deliveryWeeks.map((week) => (
            <option key={week.value} value={week.value}>
              {week.label}
            </option>
          ))}
        </select>
        {errors.deliveryWeek && <p className="text-red-500 text-sm mt-1">{errors.deliveryWeek}</p>}
      </div>

      {/* Section 3: Weekly Basket */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            3
          </span>
          WEEKLY BASKET
        </h3>

        <p className="text-[--color-charcoal]/70 mb-4">
          Would you like the YaYa&apos;s Kitchen Weekly Basket this week?
        </p>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
            <input
              type="radio"
              name="weeklyBasket"
              value="Yes"
              checked={formData.weeklyBasket === 'Yes'}
              onChange={handleChange}
              className="w-5 h-5 accent-[--color-gold]"
            />
            <span className="flex-1">Yes, include the Core Weekly Basket</span>
            <span className="font-headline text-[--color-gold]">$175</span>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
            <input
              type="radio"
              name="weeklyBasket"
              value="No"
              checked={formData.weeklyBasket === 'No'}
              onChange={handleChange}
              className="w-5 h-5 accent-[--color-gold]"
            />
            <span className="flex-1">Not this week</span>
          </label>
        </div>

        {/* Gift Basket for Friend or Relative */}
        <div className="mt-6 pt-6 border-t border-[--color-charcoal]/10">
          <p className="text-[--color-charcoal]/70 mb-4">
            Would you like to send a weekly basket to a friend or relative?
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
              <input
                type="radio"
                name="giftBasket"
                value="Yes"
                checked={formData.giftBasket === 'Yes'}
                onChange={handleChange}
                className="w-5 h-5 accent-[--color-gold]"
              />
              <span className="flex-1">Yes, send a Core Weekly Basket as a gift</span>
              <span className="font-headline text-[--color-gold]">$175</span>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
              <input
                type="radio"
                name="giftBasket"
                value="No"
                checked={formData.giftBasket === 'No'}
                onChange={handleChange}
                className="w-5 h-5 accent-[--color-gold]"
              />
              <span className="flex-1">No gift basket</span>
            </label>
          </div>

          {/* Gift Basket Recipient Details (Conditional) */}
          <AnimatePresence>
            {formData.giftBasket === 'Yes' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 ml-6 pl-4 border-l-2 border-[--color-gold]"
              >
                <label htmlFor="giftBasketRecipient" className={labelClasses}>
                  Friend/Relative Name & Delivery Address *
                </label>
                <textarea
                  id="giftBasketRecipient"
                  name="giftBasketRecipient"
                  value={formData.giftBasketRecipient}
                  onChange={handleChange}
                  rows={3}
                  className={inputClasses('giftBasketRecipient')}
                  placeholder="Recipient name, street address, city, zip code, and phone number"
                />
                {errors.giftBasketRecipient && (
                  <p className="text-red-500 text-sm mt-1">{errors.giftBasketRecipient}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Section 4: Dinner Anchor (Conditional) */}
      <AnimatePresence>
        {formData.weeklyBasket === 'Yes' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={sectionClasses}
          >
            <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
                4
              </span>
              DINNER OPTIONS
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
                <input
                  type="radio"
                  name="dinnerAnchor"
                  value="None"
                  checked={formData.dinnerAnchor === 'None'}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[--color-gold]"
                />
                <span className="flex-1">No additional dinner options this week</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
                <input
                  type="radio"
                  name="dinnerAnchor"
                  value="Add-On"
                  checked={formData.dinnerAnchor === 'Add-On'}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[--color-gold]"
                />
                <span className="flex-1">Add extra dinner options</span>
                <span className="font-headline text-[--color-gold]">$68–78</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-[--color-gold] bg-[--color-gold]/5 cursor-pointer hover:bg-[--color-gold]/10 transition-colors">
                <input
                  type="radio"
                  name="dinnerAnchor"
                  value="Bundle"
                  checked={formData.dinnerAnchor === 'Bundle'}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[--color-gold]"
                />
                <span className="flex-1">
                  <span className="block">Core Weekly Basket + Extra Dinners</span>
                  <span className="text-sm text-[--color-green]">Most Popular</span>
                </span>
                <span className="font-headline text-[--color-gold]">$175+</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 5: Optional Add-Ons */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            5
          </span>
          OPTIONAL ADD-ONS
        </h3>

        {/* Smoothies */}
        <div className="mb-6">
          <label htmlFor="smoothieQty" className={labelClasses}>
            Smoothies
          </label>
          <select
            id="smoothieQty"
            name="smoothieQty"
            value={formData.smoothieQty}
            onChange={handleChange}
            className={`${inputClasses('smoothieQty')} cursor-pointer`}
          >
            <option value="0">No smoothies</option>
            <option value="1">1 smoothie ($15)</option>
            <option value="2">2 smoothies ($30)</option>
            <option value="3">3 smoothies ($45)</option>
          </select>
          <p className="text-sm text-[--color-charcoal]/60 mt-1">16 oz each — protein forward, greens, fruit, collagen, almond milk, monkfruit (NO SUGAR ADDED)</p>
        </div>

        {/* Dessert */}
        <div className="mb-6">
          <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
            <input
              type="checkbox"
              name="dessert"
              checked={formData.dessert}
              onChange={handleChange}
              className="w-5 h-5 accent-[--color-gold]"
            />
            <span className="flex-1">
              <span className="block">Add weekly dessert</span>
              <span className="text-sm text-[--color-charcoal]/60">
                Cakes, pies, cobblers, pavlova, cheesecake (serves 4–6)
              </span>
            </span>
            <span className="font-headline text-[--color-gold]">$20–45</span>
          </label>
        </div>

        {/* Flowers for Home */}
        <div className="mb-6">
          <label htmlFor="flowersHome" className={labelClasses}>
            Flowers for Home
          </label>
          <select
            id="flowersHome"
            name="flowersHome"
            value={formData.flowersHome}
            onChange={handleChange}
            className={`${inputClasses('flowersHome')} cursor-pointer`}
          >
            <option value="None">No flowers</option>
            <option value="1 arrangement">1 arrangement ($25)</option>
            <option value="2-3 arrangements">2–3 arrangements ($50+)</option>
          </select>
        </div>

        {/* Flowers as Gift */}
        <div className="mb-4">
          <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
            <input
              type="checkbox"
              name="flowersGift"
              checked={formData.flowersGift}
              onChange={handleChange}
              className="w-5 h-5 accent-[--color-gold]"
            />
            <span className="flex-1">
              <span className="block">Send flowers as a gift</span>
              <span className="text-sm text-[--color-charcoal]/60">
                Same pricing, delivery fee may apply
              </span>
            </span>
          </label>
        </div>

        {/* Gift Recipient (Conditional) */}
        <AnimatePresence>
          {formData.flowersGift && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-6 pl-4 border-l-2 border-[--color-gold]"
            >
              <label htmlFor="giftRecipient" className={labelClasses}>
                Gift Recipient Details
              </label>
              <textarea
                id="giftRecipient"
                name="giftRecipient"
                value={formData.giftRecipient}
                onChange={handleChange}
                rows={2}
                className={inputClasses('giftRecipient')}
                placeholder="Recipient name, address, and phone number"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gift Message (Conditional - shown when gift basket OR flowers gift) */}
      <AnimatePresence>
        {showGiftMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={sectionClasses}
          >
            <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </span>
              GIFT MESSAGE
            </h3>

            <label htmlFor="giftMessage" className={labelClasses}>
              Personal Message for Recipient
            </label>
            <textarea
              id="giftMessage"
              name="giftMessage"
              value={formData.giftMessage}
              onChange={handleChange}
              rows={3}
              className={inputClasses('giftMessage')}
              placeholder="Your gift message..."
            />
            <p className="text-sm text-[--color-charcoal]/60 mt-1">
              We&apos;ll include this with your gift delivery
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 6: Delivery Preferences */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            6
          </span>
          ADDITIONAL OPTIONS
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
            <input
              type="checkbox"
              name="arrivalBasket"
              checked={formData.arrivalBasket}
              onChange={handleChange}
              className="w-5 h-5 accent-[--color-gold]"
            />
            <span className="flex-1">
              <span className="block">Arrival Basket</span>
              <span className="text-sm text-[--color-charcoal]/60">
                Perfect for vacation rentals — stock your kitchen before you arrive
              </span>
            </span>
            <span className="font-headline text-[--color-gold]">$105–125</span>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 border-[--color-charcoal]/20 cursor-pointer hover:border-[--color-gold] transition-colors">
            <input
              type="checkbox"
              name="pantryStarter"
              checked={formData.pantryStarter}
              onChange={handleChange}
              className="w-5 h-5 accent-[--color-gold]"
            />
            <span className="flex-1">
              <span className="block">Basic Pantry Starter</span>
              <span className="text-sm text-[--color-charcoal]/60">
                Coffee/tea, eggs, milk, olive oil, salt & pepper
              </span>
            </span>
            <span className="font-headline text-[--color-gold]">$45–65</span>
          </label>
        </div>
      </div>

      {/* Section 7: Container Deposit */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            7
          </span>
          CONTAINER DEPOSIT
        </h3>

        <label
          className={`flex items-start gap-3 p-4 border-2 cursor-pointer transition-colors ${
            errors.containerDeposit
              ? 'border-red-400 bg-red-50'
              : 'border-[--color-charcoal]/20 hover:border-[--color-gold]'
          }`}
        >
          <input
            type="checkbox"
            name="containerDeposit"
            checked={formData.containerDeposit}
            onChange={handleChange}
            className="w-5 h-5 accent-[--color-gold] mt-0.5"
          />
          <span className="flex-1">
            <span className="block font-medium">
              I understand a refundable container deposit applies ($30–40)
            </span>
            <span className="text-sm text-[--color-charcoal]/60">
              Deposit is returned when you bring back the containers
            </span>
          </span>
        </label>
        {errors.containerDeposit && (
          <p className="text-red-500 text-sm mt-2">{errors.containerDeposit}</p>
        )}
      </div>

      {/* Section 8: Subscription Interest */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            8
          </span>
          SUBSCRIPTION
        </h3>

        <label className="flex items-start gap-3 p-4 border-2 border-[--color-gold] bg-[--color-gold]/5 cursor-pointer hover:bg-[--color-gold]/10 transition-colors">
          <input
            type="checkbox"
            name="subscriptionInterest"
            checked={formData.subscriptionInterest}
            onChange={handleChange}
            className="w-5 h-5 accent-[--color-gold] mt-0.5"
          />
          <span className="flex-1">
            <span className="block font-medium">
              I&apos;m interested in a weekly subscription
            </span>
            <span className="text-sm text-[--color-green] font-medium">
              Save 15% on every order
            </span>
            <span className="text-sm text-[--color-charcoal]/60 block mt-1">
              We&apos;ll reach out with details — no commitment required
            </span>
          </span>
        </label>
      </div>

      {/* Section 9: Special Notes */}
      <div className="mb-10">
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            9
          </span>
          SPECIAL NOTES
        </h3>

        <textarea
          id="specialNotes"
          name="specialNotes"
          value={formData.specialNotes}
          onChange={handleChange}
          rows={4}
          className={inputClasses('specialNotes')}
          placeholder="Dietary needs, allergies, or anything else we should know"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-[--color-gold] text-[--color-charcoal] font-headline text-lg tracking-widest uppercase px-8 py-5 border-2 border-[--color-gold] hover:bg-[--color-purple] hover:border-[--color-purple] hover:text-[--color-green] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-purple] focus-visible:ring-offset-2"
      >
        {status === 'submitting' ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Submitting...
          </>
        ) : (
          'Place My Order'
        )}
      </button>

      <p className="text-center text-sm text-[--color-charcoal]/60 mt-4">
        Questions? Email{' '}
        <a href="mailto:hello@yayaskitchen.com" className="text-[--color-purple] hover:text-[--color-green] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-purple] focus-visible:ring-offset-2">
          hello@yayaskitchen.com
        </a>
      </p>
    </form>
  )
}
