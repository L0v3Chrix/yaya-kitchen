import SplitSection from './SplitSection'

export default function ArrivalBaskets() {
  return (
    <SplitSection
      id="arrival"
      imagePosition="right"
      image={{
        src: '/images/sections/arrival-basket.webp',
        alt: 'Fresh groceries and produce for arrival basket',
      }}
      scriptLabel="For Travelers"
      headline="ARRIVAL BASKETS"
      content={
        <>
          <p>
            Arriving at your vacation rental or beach house? Let YaYa&apos;s Kitchen
            stock your kitchen before you get there.
          </p>
          <p>
            Our arrival baskets include pantry essentials, fresh produce, breakfast
            items, and snacks — everything you need to settle in without the
            hassle of a grocery run.
          </p>
          <ul className="list-none space-y-2 mt-4">
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Pantry staples & cooking basics
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Fresh local produce
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Breakfast & snack items
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[--color-gold]">&#8226;</span>
              Optional wine & treats
            </li>
          </ul>
        </>
      }
      cta={{
        text: 'Plan Your Arrival',
        href: '#order',
      }}
    />
  )
}
