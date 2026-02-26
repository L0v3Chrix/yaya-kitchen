'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id') ?? null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full text-center"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 bg-[--color-green] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <svg 
          className="w-12 h-12 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      {/* Title */}
      <h1 className="font-headline text-3xl tracking-wide text-[--color-charcoal] mb-4">
        THANK YOU!
      </h1>

      <p className="text-[--color-charcoal]/70 mb-8 text-lg">
        Your order is confirmed and paid. YaYa is already getting excited 
        to prepare your basket!
      </p>

      {/* What's Next Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-md mb-8 text-left"
      >
        <h2 className="font-headline text-sm tracking-wider text-[--color-charcoal] mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-[--color-gold] rounded-full flex items-center justify-center text-xs text-white">
            ✓
          </span>
          WHAT&apos;S NEXT
        </h2>
        <ul className="space-y-3 text-[--color-charcoal]/80">
          <li className="flex items-start gap-3">
            <span className="text-[--color-gold] mt-0.5">📧</span>
            <span>Confirmation email sent to your inbox</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[--color-gold] mt-0.5">📅</span>
            <span>Your basket will be delivered <strong>Friday 9-11am</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[--color-gold] mt-0.5">📱</span>
            <span>YaYa will text when she&apos;s on the way</span>
          </li>
        </ul>
      </motion.div>

      {/* Container Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[--color-purple]/10 p-4 rounded-lg mb-8 text-left border-l-4 border-[--color-purple]"
      >
        <h3 className="font-headline text-xs tracking-wider text-[--color-charcoal] mb-2">
          🧺 ABOUT YOUR CONTAINERS
        </h3>
        <p className="text-sm text-[--color-charcoal]/70">
          Your first order includes a refundable container deposit. Just rinse and 
          leave your containers out on Friday — YaYa will swap them for fresh ones!
        </p>
      </motion.div>

      {/* Back Link */}
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-[--color-purple] hover:text-[--color-green] font-headline tracking-wider text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to YaYa&apos;s Kitchen
      </Link>

      {/* Questions */}
      <p className="mt-8 text-sm text-[--color-charcoal]/60">
        Questions? Text YaYa at{' '}
        <a 
          href="sms:3039106971" 
          className="text-[--color-purple] hover:text-[--color-green]"
        >
          (303) 910-6971
        </a>
      </p>
    </motion.div>
  )
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[--color-cream] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[--color-gold] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[--color-charcoal]/60">Loading...</p>
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
    </main>
  )
}
