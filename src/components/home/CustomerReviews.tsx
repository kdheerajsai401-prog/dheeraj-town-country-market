"use client"

import { motion } from "motion/react"
import { TestimonialsColumn } from "@/components/ui/testimonials-columns"
import type { Testimonial } from "@/components/ui/testimonials-columns"

const reviews: Testimonial[] = [
  {
    text: "Open 24/7 and always fully stocked. I've stopped at 2am more times than I can count and they always have exactly what I need. Friendly staff every single time.",
    name: "Priya S.",
    location: "Mississauga, ON",
  },
  {
    text: "The home-made bakery items here are incredible. Fresh every morning and the prices are fair. My family picks up bread and pastries at least twice a week.",
    name: "Michael T.",
    location: "Duke of York location",
  },
  {
    text: "Best convenience store in the area by far. Great selection of fresh produce, dairy, and snacks. Way better than a typical corner store.",
    name: "Aisha R.",
    location: "Mississauga, ON",
  },
  {
    text: "I love that I can order through Uber Eats at midnight and get groceries delivered. The packing is always neat and nothing is ever missing.",
    name: "James K.",
    location: "Hurontario location",
  },
  {
    text: "Picked up beer, snacks, and some last-minute birthday items here late at night. Everything was fresh and the staff helped me find things quickly. Will be back!",
    name: "Danielle M.",
    location: "Mississauga, ON",
  },
  {
    text: "This place saved me so many times during late-night grocery runs. Huge selection compared to other 24-hour spots and the store is always clean.",
    name: "Raj P.",
    location: "Duke of York location",
  },
  {
    text: "Honestly the freshest produce I've found at a convenience store. Picked up avocados and they were perfect. Staff is super welcoming and helpful.",
    name: "Sofia B.",
    location: "Mississauga, ON",
  },
  {
    text: "Two locations, both open all day and night. I go to the Hurontario one after gym and they always have protein bars, fresh fruit and drinks. Great local store.",
    name: "Kevin L.",
    location: "Hurontario location",
  },
  {
    text: "They carry so many international and specialty food items I can't find at regular grocery stores. Feels like a mini supermarket. Love this place.",
    name: "Nadia A.",
    location: "Mississauga, ON",
  },
]

const col1 = reviews.slice(0, 3)
const col2 = reviews.slice(3, 6)
const col3 = reviews.slice(6, 9)

export function CustomerReviews() {
  return (
    <section className="py-16 sm:py-20 bg-warm-surface relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center max-w-lg mx-auto mb-12"
        >
          <span className="inline-block border border-warm-text/20 text-warm-muted text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Customer Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-warm-text tracking-tight">
            What our neighbours say
          </h2>
          <p className="text-warm-muted mt-3 text-sm">
            Real 5-star reviews from our regulars in Mississauga.
          </p>
        </motion.div>

        {/* Scrolling columns */}
        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[680px] overflow-hidden">
          <TestimonialsColumn testimonials={col1} duration={18} />
          <TestimonialsColumn testimonials={col2} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={col3} className="hidden lg:block" duration={20} />
        </div>
      </div>
    </section>
  )
}
