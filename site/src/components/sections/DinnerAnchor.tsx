import SplitSection from './SplitSection'

export default function DinnerAnchor() {
  return (
    <SplitSection
      id="dinner-anchor"
      imagePosition="right"
      image={{
        src: '/images/food/chicken-plum-web.webp',
        alt: 'Chicken with plum sauce',
      }}
      scriptLabel="One Complete Dinner"
      headline="THE DINNER ANCHOR"
      content={
        <>
          <p>
            The centerpiece of your week: a complete, restaurant-quality dinner
            that brings everyone to the table. Each week features a new culinary
            adventure.
          </p>
          <p>
            From succulent roasted proteins to thoughtfully prepared sides,
            every dinner anchor is designed to create memories around your table.
          </p>
          <p className="text-sm text-[--color-charcoal]/60 mt-4">
            Recent favorites: Chicken with Plum Sauce, Herb-Crusted Pork Tenderloin,
            Garlic Shrimp with Seasonal Vegetables
          </p>
        </>
      }
      cta={{
        text: 'View This Week\'s Menu',
        href: '#order',
      }}
    />
  )
}
