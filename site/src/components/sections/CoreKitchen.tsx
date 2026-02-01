import SplitSection from './SplitSection'

export default function CoreKitchen() {
  return (
    <SplitSection
      id="core-kitchen"
      imagePosition="left"
      image={{
        src: '/images/sections/arrival-basket.webp',
        alt: 'YaYa\'s Kitchen Basket',
      }}
      scriptLabel="See What's Inside"
      headline="CORE KITCHEN BASKET"
      backgroundColor="cream-dark"
      content={
        <>
          <ul className="list-none space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              A loaf of Homemade Bread
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Friday Night Board
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Bowls
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Classic Family Meal
            </li>
          </ul>
          <p className="text-sm text-[--color-charcoal]/70 mb-4">
            <strong>Note:</strong> Portions are sized for 2 adults and 2 children, 
            with an option to increase portions for older children or up to 4 adults.
          </p>
          <p className="font-headline text-lg text-[--color-charcoal]">
            Price Range: <span className="text-[--color-gold]">$100 - $155</span>
          </p>
        </>
      }
    />
  )
}
