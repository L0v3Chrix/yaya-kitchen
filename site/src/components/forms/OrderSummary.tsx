'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { OrderTotal, formatCurrency } from '@/lib/calculate-order'

interface OrderSummaryProps {
  total: OrderTotal
  isLoading?: boolean
  onCheckout: () => void
  disabled?: boolean
}

export default function OrderSummary({ 
  total, 
  isLoading = false,
  onCheckout,
  disabled = false,
}: OrderSummaryProps) {
  const hasItems = total.lineItems.length > 0

  if (!hasItems) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-[--color-gold] rounded-lg shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[--color-gold]/10 px-6 py-4 border-b border-[--color-gold]/30">
        <h3 className="font-headline text-lg tracking-wider text-[--color-charcoal] flex items-center gap-2">
          <svg className="w-5 h-5 text-[--color-gold]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          YOUR ORDER
        </h3>
      </div>

      {/* Line Items */}
      <div className="px-6 py-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {total.breakdown.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between text-[--color-charcoal]/80"
            >
              <span className="text-sm">{item.label}</span>
              <span className="font-medium">{formatCurrency(item.amount)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Subtotal & Fees */}
      <div className="px-6 py-3 border-t border-[--color-charcoal]/10 space-y-2">
        <div className="flex justify-between text-[--color-charcoal]/70">
          <span className="text-sm">Subtotal</span>
          <span className="font-medium">{formatCurrency(total.subtotal)}</span>
        </div>

        {total.containerDeposit > 0 && (
          <div className="flex justify-between text-[--color-charcoal]/70">
            <span className="text-sm flex items-center gap-1">
              Container Deposit
              <span className="text-xs text-[--color-green]">(refundable)</span>
            </span>
            <span className="font-medium">{formatCurrency(total.containerDeposit)}</span>
          </div>
        )}

        {total.deliveryFee > 0 && (
          <div className="flex justify-between text-amber-600">
            <span className="text-sm">Out-of-Zone Delivery</span>
            <span className="font-medium">{formatCurrency(total.deliveryFee)}</span>
          </div>
        )}

        {total.discount > 0 && (
          <div className="flex justify-between text-[--color-green]">
            <span className="text-sm">Subscription Discount (15%)</span>
            <span className="font-medium">-{formatCurrency(total.discount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="px-6 py-4 bg-[--color-charcoal] text-white">
        <div className="flex justify-between items-center">
          <span className="font-headline tracking-wider">TOTAL</span>
          <span className="text-2xl font-headline">{formatCurrency(total.total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="p-6 bg-[--color-cream]">
        <button
          type="button"
          onClick={onCheckout}
          disabled={disabled || isLoading || !hasItems}
          className="w-full bg-[--color-gold] text-[--color-charcoal] font-headline text-lg tracking-widest uppercase px-8 py-4 border-2 border-[--color-gold] hover:bg-[--color-purple] hover:border-[--color-purple] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
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
              Redirecting to Checkout...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Proceed to Checkout
            </>
          )}
        </button>

        <p className="text-center text-xs text-[--color-charcoal]/60 mt-3 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure checkout powered by Stripe
        </p>
      </div>
    </motion.div>
  )
}
