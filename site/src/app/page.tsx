import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import WeeklyBasket from '@/components/sections/WeeklyBasket'
import BasketDetails from '@/components/sections/BasketDetails'
import FullWidthImage from '@/components/sections/FullWidthImage'
import CoreKitchen from '@/components/sections/CoreKitchen'
import DinnerAnchor from '@/components/sections/DinnerAnchor'
import Flowers from '@/components/sections/Flowers'
import DessertGallery from '@/components/sections/DessertGallery'
import ArrivalBaskets from '@/components/sections/ArrivalBaskets'
import AboutYaya from '@/components/sections/AboutYaya'
import OrderForm from '@/components/forms/OrderForm'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Weekly Basket (Text Left, Image Right) */}
        <WeeklyBasket />

        {/* 2b. Basket Details (replaces modal) */}
        <BasketDetails />

        {/* 3. Full-Width Image Break - Focaccia Art */}
        <FullWidthImage
          src="/images/food/focaccia-art-web.webp"
          alt="Beautiful focaccia bread with vegetable art"
          height="medium"
        />

        {/* 4. Core Kitchen (Image Left, Text Right) */}
        <CoreKitchen />

        {/* 5. Dinner Anchor (Text Left, Image Right) */}
        <DinnerAnchor />

        {/* 6. Full-Width Image Break - Appetizers */}
        <FullWidthImage
          src="/images/food/appetizers-web.webp"
          alt="Delicious appetizers spread"
          height="short"
        />

        {/* 7. Flowers (Image Left, Text Right) */}
        <Flowers />

        {/* 8. Dessert Gallery */}
        <DessertGallery />

        {/* 9. Arrival Baskets (Text Left, Image Right) */}
        <ArrivalBaskets />

        {/* 10. About YaYa */}
        <AboutYaya />

        {/* 11. Order Form Section */}
        <section id="order" className="py-20 md:py-32 bg-[--color-cream-dark]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="font-script italic text-2xl text-[--color-gold] block mb-4">
                Ready to Order?
              </span>
              <h2 className="font-headline text-3xl md:text-4xl tracking-wide text-[--color-charcoal] mb-4">
                START YOUR ORDER
              </h2>
              <p className="text-[--color-charcoal]/70">
                Fill out the form below and we&apos;ll prepare your basket with care.
              </p>
            </div>
            <OrderForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
