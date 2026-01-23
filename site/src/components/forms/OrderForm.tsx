'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  weeklyBasket: 'Yes' | 'No'
  dinnerAnchor: 'None' | 'Add-On' | 'Bundle'
  smoothieQty: '0' | '1' | '2' | '3'
  dessert: boolean
  flowersHome: 'None' | '1 arrangement' | '2-3 arrangements'
  flowersGift: boolean
  giftRecipient: string
  arrivalBasket: boolean
  pantryStarter: boolean
  containerDeposit: boolean
  specialNotes: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  weeklyBasket: 'Yes',
  dinnerAnchor: 'None',
  smoothieQty: '0',
  dessert: false,
  flowersHome: 'None',
  flowersGift: false,
  giftRecipient: '',
  arrivalBasket: false,
  pantryStarter: false,
  containerDeposit: false,
  specialNotes: '',
}

// Will be replaced with actual Google Apps Script URL
const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || ''

export default function OrderForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

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
      // Prepare data for submission
      const submitData = {
        ...formData,
        dessert: formData.dessert ? 'Yes' : 'No',
        flowersGift: formData.flowersGift ? 'Yes' : 'No',
        arrivalBasket: formData.arrivalBasket ? 'Yes' : 'No',
        pantryStarter: formData.pantryStarter ? 'Yes' : 'No',
        containerDeposit: formData.containerDeposit ? 'Yes' : 'No',
      }

      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        })
      }

      // Since no-cors doesn't return response, assume success
      setStatus('success')
      setFormData(initialFormData)
    } catch {
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
            className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 mb-8"
          >
            <p className="font-medium">Something went wrong. Please try again or email us directly.</p>
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
            placeholder="Street address, city, zip code"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
      </div>

      {/* Section 2: Weekly Basket */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            2
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
            <span className="flex-1">Yes, include the Weekly Basket</span>
            <span className="font-headline text-[--color-gold]">$70–90</span>
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
      </div>

      {/* Section 3: Dinner Anchor (Conditional) */}
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
                3
              </span>
              DINNER ANCHOR
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
                <span className="flex-1">No dinner anchor this week</span>
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
                <span className="flex-1">Add Dinner Anchor</span>
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
                  <span className="block">Bundle: Core Basket + Dinner Anchor</span>
                  <span className="text-sm text-[--color-green]">Recommended — Save $15+</span>
                </span>
                <span className="font-headline text-[--color-gold]">$135–155</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 4: Optional Add-Ons */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            4
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
            <option value="1">1 smoothie ($7–9)</option>
            <option value="2">2 smoothies ($14–18)</option>
            <option value="3">3 smoothies ($21–27)</option>
          </select>
          <p className="text-sm text-[--color-charcoal]/60 mt-1">~16 oz each</p>
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
                Rotates: cobbler, cake, tart, ice cream (serves 4–6)
              </span>
            </span>
            <span className="font-headline text-[--color-gold]">$16–30</span>
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
            <option value="1 arrangement">1 arrangement ($15–18)</option>
            <option value="2-3 arrangements">2–3 arrangements ($30–45)</option>
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
                placeholder="Recipient name, address, and any special message"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 5: One-Time & Traveler Options */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            5
          </span>
          ONE-TIME & TRAVELER OPTIONS
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

      {/* Section 6: Container Deposit */}
      <div className={sectionClasses}>
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            6
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

      {/* Section 7: Special Notes */}
      <div className="mb-10">
        <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[--color-purple] text-white flex items-center justify-center text-sm">
            7
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
          placeholder="Dietary needs, allergies, delivery instructions, or anything else we should know"
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
