import SplitSection from './SplitSection'

export default function DinnerAnchor() {
  return (
    <>
      {/* Main Weekly Dinner Basket Section */}
      <SplitSection
        id="dinner-anchor"
        imagePosition="right"
        image={{
          src: '/images/desserts/dinner-plate-special.webp',
          alt: 'Plated dinner with stuffed meat, green puree and roasted potatoes',
        }}
        scriptLabel="Comfort delivered"
        headline="WEEKLY DINNER BASKET"
        content={
          <>
            <p className="mb-4">
              <strong>Boards</strong> — themed gather-and-eat style meats, cheeses, 
              veggies & fruits, nuts, spreads, bread & crackers & a special item each week
            </p>
            <p className="mb-4">
              <strong>Bowls</strong> — Warm composed meals built around protein, 
              grain or starch, veggies & sauce
            </p>
            <p className="mb-6">
              <strong>Classic Dinner</strong> — Entree, side and grain or starch or 
              two veggies (we can accommodate some vegetarian choices)
            </p>

            <h4 className="font-headline text-lg tracking-wide text-[--color-charcoal] mb-3">
              Optional Additions:
            </h4>
            <ul className="list-none space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">&#8226;</span>
                <span><strong>Smoothies</strong> — 16 oz - protein forward, greens, fruit, collagen, almond milk and monkfruit - NO SUGAR ADDED</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">&#8226;</span>
                <span><strong>Dessert</strong> — cakes, pies, cobblers, pavlova, cheesecake</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">&#8226;</span>
                <span><strong>Granola</strong> — housemade (occasionally)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">&#8226;</span>
                <span><strong>Soup</strong> — housemade (occasionally)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">&#8226;</span>
                <span>Extra food for older children or other adults</span>
              </li>
            </ul>
          </>
        }
      />

      {/* Pricing Section */}
      <section className="py-16 bg-[--color-cream]">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-headline text-2xl tracking-wide text-[--color-charcoal] mb-8 text-center">
            PRICING
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/50 p-6 rounded-lg">
              <p className="flex justify-between items-center">
                <span>Weekly Basket (Core Kitchen) 2 or 3 choices</span>
                <span className="font-headline text-[--color-gold]">$100 - $155/week</span>
              </p>
            </div>
            <div className="bg-white/50 p-6 rounded-lg">
              <p className="flex justify-between items-center">
                <span>Flower Add-On</span>
                <span className="font-headline text-[--color-gold]">$25/week</span>
              </p>
            </div>
            <div className="bg-white/50 p-6 rounded-lg">
              <p className="flex justify-between items-center">
                <span>Smoothie Add-On</span>
                <span className="font-headline text-[--color-gold]">$15/week</span>
              </p>
            </div>
            <div className="bg-white/50 p-6 rounded-lg">
              <p className="flex justify-between items-center">
                <span>Dessert Add-On</span>
                <span className="font-headline text-[--color-gold]">$20 - $45</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Weekly Dinners Section */}
      <section className="py-20 bg-[--color-cream-dark]">
        <div className="max-w-4xl mx-auto px-6">
          <span className="font-script italic text-2xl text-[--color-gold] block mb-4 text-center">
            The Center of the Basket
          </span>
          <h2 className="font-headline text-3xl md:text-4xl tracking-wide text-[--color-charcoal] mb-6 text-center">
            CORE WEEKLY DINNERS
          </h2>
          <p className="text-center text-[--color-charcoal]/80 mb-8 max-w-2xl mx-auto">
            The heart of each YaYa&apos;s Kitchen week is dinner.
          </p>
          <div className="space-y-4 text-[--color-charcoal]/80 max-w-2xl mx-auto">
            <p>
              Every basket includes three fully prepared dinners designed to support your 
              family through the week with less planning, less prep, and more ease. Order 
              2 or 3 choices each week, every other week or monthly.
            </p>
            <p>
              Each dinner is thoughtfully cooked with clean ingredients and organic when 
              possible, meant to replace fast food, frozen meals, and end-of-day decision 
              fatigue. These are meals meant to gather around, enjoy, and often carry into 
              lunches the next day.
            </p>
          </div>
          
          <div className="mt-10 space-y-6 max-w-2xl mx-auto">
            <h4 className="font-headline text-lg tracking-wide text-[--color-charcoal]">
              Each week can include:
            </h4>
            <div className="space-y-4">
              <div className="bg-white/50 p-6 rounded-lg">
                <p className="font-headline text-[--color-charcoal]">
                  Friday Night Board
                </p>
                <p className="text-sm text-[--color-charcoal]/70 mt-1">
                  — a generous, relaxed start to the weekend
                </p>
              </div>
              <div className="bg-white/50 p-6 rounded-lg">
                <p className="font-headline text-[--color-charcoal]">
                  Hearty Bowl-Style Dinner
                </p>
                <p className="text-sm text-[--color-charcoal]/70 mt-1">
                  — warming, filling, and familiar
                </p>
              </div>
              <div className="bg-white/50 p-6 rounded-lg">
                <p className="font-headline text-[--color-charcoal]">
                  Classic Family Dinner
                </p>
                <p className="text-sm text-[--color-charcoal]/70 mt-1">
                  — a traditional protein, starch or grain, and vegetable
                </p>
              </div>
            </div>
            <p className="text-center font-script italic text-lg text-[--color-gold] mt-8">
              Together, they create a steady rhythm of nourishment and support for the days ahead.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
