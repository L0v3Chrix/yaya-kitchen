import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import WeeklyBasket from '@/components/sections/WeeklyBasket'
import BasketDetails from '@/components/sections/BasketDetails'
import CoreKitchen from '@/components/sections/CoreKitchen'
import DinnerAnchor from '@/components/sections/DinnerAnchor'
import Flowers from '@/components/sections/Flowers'
import DessertGallery from '@/components/sections/DessertGallery'
import ArrivalBaskets from '@/components/sections/ArrivalBaskets'
import AboutYaya from '@/components/sections/AboutYaya'
import MonthlyMenu from '@/components/sections/MonthlyMenu'
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

        {/* 3. Core Kitchen (Image Left, Text Right) */}
        <CoreKitchen />

        {/* 4. Dinner Anchor (Text Left, Image Right) */}
        <DinnerAnchor />

        {/* 5. Flowers (Image Left, Text Right) */}
        <Flowers />

        {/* 6. Dessert Gallery */}
        <DessertGallery />

        {/* 7. Arrival Baskets (Text Left, Image Right) */}
        <ArrivalBaskets />

        {/* 8. About YaYa */}
        <AboutYaya />

        {/* 9. Monthly Menu */}
        <MonthlyMenu />

        {/* 10. Order Form Section */}
        <section id="order" className="pt-10 pb-20 md:pt-14 md:pb-32 bg-[--color-cream-dark]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="font-script italic text-2xl md:text-3xl text-[--color-gold] mb-3">
                Ready to Order?
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
// Env update trigger Tue Feb 24 18:29:27 CST 2026
