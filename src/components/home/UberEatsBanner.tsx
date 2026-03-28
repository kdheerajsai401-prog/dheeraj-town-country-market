"use client"

import { motion } from "motion/react"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import { UberEatsButton } from "@/components/ui/UberEatsButton"
import { SITE } from "@/lib/content"
import { ShoppingBag } from "lucide-react"

export function UberEatsBanner() {
  return (
    <SectionWrapper className="bg-teal py-16 sm:py-20" innerClassName="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="text-white/80 text-sm font-semibold uppercase tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Delivery Available
          </motion.p>
          <motion.h2
            className="text-3xl font-bold text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Order from us on Uber Eats
          </motion.h2>
          <motion.p
            className="max-w-md text-white/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Can&apos;t make it in? Get your groceries and essentials delivered straight to your
            door — any time, day or night.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <UberEatsButton
              webUrl={SITE.uberEatsUrl}
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-pill transition-colors duration-200 bg-white hover:bg-teal-light text-teal font-bold px-8 py-4 text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              Order on Uber Eats
            </UberEatsButton>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
