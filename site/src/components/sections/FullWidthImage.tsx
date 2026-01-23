'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface FullWidthImageProps {
  src: string
  alt: string
  height?: 'short' | 'medium' | 'tall'
}

export default function FullWidthImage({
  src,
  alt,
  height = 'medium',
}: FullWidthImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  const heightClass = {
    short: 'h-[40vh] md:h-[50vh]',
    medium: 'h-[50vh] md:h-[60vh]',
    tall: 'h-[60vh] md:h-[70vh]',
  }[height]

  return (
    <section
      ref={containerRef}
      className={`relative ${heightClass} overflow-hidden`}
    >
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover scale-110"
          sizes="100vw"
        />
      </motion.div>
    </section>
  )
}
