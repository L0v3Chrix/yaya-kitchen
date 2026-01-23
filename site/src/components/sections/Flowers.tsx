import SplitSection from './SplitSection'

export default function Flowers() {
  return (
    <SplitSection
      id="flowers"
      imagePosition="left"
      image={{
        src: '/images/flowers/arrangement-colorful.webp',
        alt: 'Colorful flower arrangement in blue vase',
      }}
      scriptLabel="Beauty, Delivered"
      headline="FLOWERS, SIMPLY"
      backgroundColor="cream-dark"
      content={
        <>
          <p>
            Because nourishment isn&apos;t just about food. A fresh arrangement
            transforms your space and lifts your spirits — it&apos;s self-care
            you can see.
          </p>
          <p>
            Add a weekly flower delivery to your basket and bring a touch of
            beauty to your table, your desk, or wherever you need a moment of joy.
          </p>
          <p className="font-script italic text-lg text-[--color-gold] mt-4">
            Seasonal blooms, thoughtfully arranged.
          </p>
        </>
      }
      cta={{
        text: 'Add Flowers',
        href: '#order',
      }}
    />
  )
}
