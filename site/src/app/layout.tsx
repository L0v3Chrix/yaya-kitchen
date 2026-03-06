import type { Metadata } from 'next'
import { Cormorant_Garamond, Oswald, Lato } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-script',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-headline',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "YaYa's Kitchen — Care, Delivered Weekly",
  description: 'YaYa\'s Kitchen is a weekly meal delivery service in Wilmington, NC. Fresh, homemade meals, flowers, and treats delivered with care.',
  keywords: ['meal delivery', 'Wilmington NC', 'homemade meals', 'weekly basket', 'YaYa\'s Kitchen'],
  openGraph: {
    title: "YaYa's Kitchen — Care, Delivered Weekly",
    description: 'Fresh, homemade meals and flowers delivered with care in Wilmington, NC.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${oswald.variable} ${lato.variable}`}
    >
      <body className="antialiased">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K2HD28D0WT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K2HD28D0WT');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
