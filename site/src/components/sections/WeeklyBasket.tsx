import SplitSection from './SplitSection'

export default function WeeklyBasket() {
  return (
    <SplitSection
      id="weekly-basket"
      imagePosition="right"
      image={{
        src: '/images/sections/arrival-basket.webp',
        alt: 'YaYa\'s Kitchen weekly basket with meals, bread, smoothies and flowers',
      }}
      scriptLabel="What's Inside"
      headline="THE WEEKLY BASKET"
      content={
        <>
          <p>
            Each week, we prepare a limited number of kitchen baskets for our local 
            community — designed to reduce planning and prep, and help the week feel 
            more spacious. Food nourishes not only the body but also the soul.
          </p>
          <p>
            YaYa&apos;s Kitchen delivers a thoughtfully curated basket of homemade meals 
            designed to simplify your week and nourish your family.
          </p>
          <p>
            Food is prepared with seasonal, clean ingredients and organic when possible, 
            and is intended to replace fast food, frozen meals and processed food. 
            Weekly delivery is included.
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
