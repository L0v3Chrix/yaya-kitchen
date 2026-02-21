'use client'

import { motion } from 'framer-motion'

const basketContents = {
  coreKitchen: [
    'A loaf of Homemade Bread',
    'Friday Night Board',
    'Bowls — warm composed meals',
    'Classic Family Meal',
  ],
  weeklyDinners: [
    'Boards — themed gather-and-eat style',
    'Bowls — protein, grain/starch, veggies & sauce',
    'Classic Dinner — entree, side, grain/starch or veggies',
  ],
  extras: [
    'Smoothies — 16 oz, protein forward, NO SUGAR ADDED',
    'Dessert — cakes, pies, cobblers, pavlova',
    'Granola — housemade (occasionally)',
    'Soup — housemade (occasionally)',
    'Fresh-cut flowers',
  ],
}

const pricing = [
  { name: 'Weekly Basket (Core Kitchen) 2 or 3 choices', price: '$100–155/week' },
  { name: 'Flower Add-On', price: '$25/week' },
  { name: 'Smoothie Add-On', price: '$15/week' },
  { name: 'Dessert Add-On', price: '$20–45' },
]

export default function BasketDetails() {
  return (
    <section id="basket-details" className="py-16 md:py-24 bg-[--color-cream]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-script italic text-2xl text-[--color-gold] block mb-2">
            Everything You Need
          </span>
          <h2 className="font-headline text-3xl md:text-4xl tracking-wide text-[--color-charcoal]">
            INSIDE THE BASKET
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column - What's Included */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {/* Core Kitchen */}
            <div className="mb-8">
              <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-[--color-gold]"></span>
                CORE KITCHEN
              </h3>
              <ul className="space-y-3">
                {basketContents.coreKitchen.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[--color-charcoal]/80"
                  >
                    <span className="text-[--color-gold] mt-1">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional Extras */}
            <div>
              <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-[--color-gold]"></span>
                OPTIONAL EXTRAS
              </h3>
              <ul className="space-y-3">
                {basketContents.extras.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[--color-charcoal]/60"
                  >
                    <span className="text-[--color-gold]/50 mt-1">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Column - Pricing & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Pricing Card */}
            <div className="bg-[--color-cream-dark] p-8 mb-8">
              <h3 className="font-headline text-xl tracking-wide text-[--color-charcoal] mb-6">
                PRICING
              </h3>
              <div className="space-y-4">
                {pricing.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center border-b border-[--color-charcoal]/10 pb-3"
                  >
                    <span className="text-[--color-charcoal]/80">{item.name}</span>
                    <span className="font-headline text-[--color-gold]">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-[--color-purple] text-white p-8">
              <h3 className="font-headline text-xl tracking-wide mb-6">
                HOW IT WORKS
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-headline text-[--color-gold] text-xl">1.</span>
                  <span className="text-white/80">
                    Choose your basket type and any add-ons
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="font-headline text-[--color-gold] text-xl">2.</span>
                  <span className="text-white/80">
                    Delivery every Friday to start your weekend right
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="font-headline text-[--color-gold] text-xl">3.</span>
                  <span className="text-white/80">
                    Enjoy homemade meals all week long
                  </span>
                </li>
              </ol>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-white/60">
                  Containers are reusable — $30–40 deposit, returned when you bring them back.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <a
                href="#order"
                className="inline-block bg-[--color-gold] text-[--color-charcoal] font-headline text-lg tracking-widest uppercase px-8 py-4 border-2 border-[--color-gold] hover:bg-[--color-purple] hover:border-[--color-purple] hover:text-[--color-green] transition-all duration-200 w-full md:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-purple] focus-visible:ring-offset-2"
              >
                Start Your Order
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
