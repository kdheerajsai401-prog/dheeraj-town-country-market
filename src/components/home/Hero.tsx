"use client"

import { UberEatsButton } from "@/components/ui/UberEatsButton"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { Clock, MapPin } from "lucide-react"
import { SITE } from "@/lib/content"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Background parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  // Text fade
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80])

  // Basket
  const basketY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const basketScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05])

  // Fruits rise out of basket
  const appleY = useTransform(scrollYProgress, [0, 0.6], [0, -180])
  const appleX = useTransform(scrollYProgress, [0, 0.6], [0, -60])
  const appleRotate = useTransform(scrollYProgress, [0, 0.6], [0, -25])
  const appleScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.8, 1.1, 1.2])

  const orangeY = useTransform(scrollYProgress, [0, 0.6], [0, -220])
  const orangeX = useTransform(scrollYProgress, [0, 0.6], [0, 40])
  const orangeRotate = useTransform(scrollYProgress, [0, 0.6], [0, 20])
  const orangeScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.7, 1, 1.15])

  const lemonY = useTransform(scrollYProgress, [0, 0.6], [0, -160])
  const lemonX = useTransform(scrollYProgress, [0, 0.6], [0, -90])
  const lemonRotate = useTransform(scrollYProgress, [0, 0.6], [0, 35])
  const lemonScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.6, 0.9, 1.05])

  const leafY = useTransform(scrollYProgress, [0, 0.7], [0, -260])
  const leafX = useTransform(scrollYProgress, [0, 0.7], [0, 70])
  const leafRotate = useTransform(scrollYProgress, [0, 0.7], [0, 45])
  const leafScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [0.5, 0.8, 1])
  const leafOpacity = useTransform(scrollYProgress, [0, 0.15, 0.5], [0, 1, 1])

  // Wine bottles
  const wineY = useTransform(scrollYProgress, [0, 0.6], [0, -40])
  const wineScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.05])

  // Cork pops out
  const corkY = useTransform(scrollYProgress, [0, 0.15, 0.5], [0, -20, -200])
  const corkRotate = useTransform(scrollYProgress, [0, 0.15, 0.5], [0, -10, -60])
  const corkScale = useTransform(scrollYProgress, [0, 0.15, 0.5], [0.6, 0.8, 1.2])
  const corkOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [0, 0.5, 1])

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0])

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background with parallax */}
        <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
          <img
            src="/images/hero-grocery.jpg"
            alt="Town & Country Market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        <motion.div style={{ opacity: sceneOpacity }} className="relative z-10 h-full">
          {/* Text */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute inset-0 flex flex-col items-center justify-start pt-24 md:pt-32 text-center px-6 z-30"
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                Town & Country
                <br />
                <span className="text-gold">Market</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
                {SITE.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-full text-white">
                <Clock size={18} />
                <span className="text-sm font-medium">Open 24/7</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-full text-white">
                <MapPin size={18} />
                <span className="text-sm font-medium">2 Locations in Mississauga</span>
              </div>
              <UberEatsButton
                webUrl={SITE.uberEatsUrl}
                className="flex items-center gap-2 bg-gold hover:bg-gold/90 transition-colors px-5 py-3 rounded-full text-white text-sm font-semibold"
              >
                Order on Uber Eats
              </UberEatsButton>
            </motion.div>
          </motion.div>

          {/* 3D Layered Scene */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Floating leaf */}
            <motion.img
              src="/images/hero-leaf.png"
              alt=""
              className="absolute w-16 md:w-24"
              style={{
                top: "18%",
                right: "15%",
                y: leafY,
                x: leafX,
                rotate: leafRotate,
                scale: leafScale,
                opacity: leafOpacity,
              }}
            />

            {/* Apple */}
            <motion.img
              src="/images/hero-apple.png"
              alt=""
              className="absolute w-20 md:w-28"
              style={{
                bottom: "22%",
                left: "18%",
                y: appleY,
                x: appleX,
                rotate: appleRotate,
                scale: appleScale,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />

            {/* Orange */}
            <motion.img
              src="/images/hero-orange.png"
              alt=""
              className="absolute w-16 md:w-24"
              style={{
                bottom: "25%",
                left: "32%",
                y: orangeY,
                x: orangeX,
                rotate: orangeRotate,
                scale: orangeScale,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            />

            {/* Lemon */}
            <motion.img
              src="/images/hero-lemon.png"
              alt=""
              className="absolute w-14 md:w-20"
              style={{
                bottom: "18%",
                left: "10%",
                y: lemonY,
                x: lemonX,
                rotate: lemonRotate,
                scale: lemonScale,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            />

            {/* Basket */}
            <motion.img
              src="/images/hero-basket.png"
              alt="Fresh produce basket"
              className="absolute w-56 md:w-72 lg:w-80"
              style={{
                bottom: "5%",
                left: "10%",
                y: basketY,
                scale: basketScale,
              }}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Wine bottles */}
            <motion.img
              src="/images/hero-wine.png"
              alt="Premium wine selection"
              className="absolute w-40 md:w-56 lg:w-64"
              style={{
                bottom: "5%",
                right: "8%",
                y: wineY,
                scale: wineScale,
              }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Cork */}
            <motion.img
              src="/images/hero-cork.png"
              alt=""
              className="absolute w-12 md:w-16"
              style={{
                bottom: "55%",
                right: "18%",
                y: corkY,
                rotate: corkRotate,
                scale: corkScale,
                opacity: corkOpacity,
              }}
            />
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
            style={{ opacity: textOpacity }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1.5"
            >
              <div className="w-1.5 h-3 bg-white/70 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
