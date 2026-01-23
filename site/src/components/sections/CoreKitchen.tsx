import SplitSection from './SplitSection'

export default function CoreKitchen() {
  return (
    <SplitSection
      id="core-kitchen"
      imagePosition="left"
      image={{
        src: '/images/food/soup-tomato.webp',
        alt: 'Elegant tomato soup with gold charger',
      }}
      scriptLabel="Comfort, Weekly"
      headline="CORE KITCHEN"
      backgroundColor="cream-dark"
      content={
        <>
          <p>
            The heart of every basket: warming soups, fresh salads, artisan breads,
            and wholesome breakfast options that turn ordinary mornings into
            something special.
          </p>
          <p>
            Each item is crafted to bring comfort and convenience to your daily
            routine — because even the simplest meals deserve care.
          </p>
          <ul className="list-none space-y-2 mt-4">
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Seasonal soups & stews
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Fresh-baked breads
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Garden salads & dressings
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Breakfast favorites
            </li>
          </ul>
        </>
      }
    />
  )
}
