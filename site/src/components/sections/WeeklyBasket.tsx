import SplitSection from './SplitSection'

export default function WeeklyBasket() {
  return (
    <SplitSection
      id="weekly-basket"
      imagePosition="right"
      image={{
        src: '/images/food/focaccia-art-web.webp',
        alt: 'Beautiful focaccia bread with vegetable art',
      }}
      scriptLabel="What's Inside"
      headline="THE WEEKLY BASKET"
      content={
        <>
          <p>
            Each week, YaYa&apos;s Kitchen delivers a thoughtfully curated basket of
            homemade meals designed to simplify your week and nourish your family.
          </p>
          <p>
            Every basket includes breakfast items, lunch components, snacks, and
            a complete dinner — all prepared with care using fresh, seasonal
            ingredients.
          </p>
          <p className="font-script italic text-lg text-[--color-gold]">
            No meal planning. No grocery runs. Just delicious food, ready when you are.
          </p>
        </>
      }
      cta={{
        text: 'See What\'s Inside',
        href: '#basket-details',
      }}
    />
  )
}
