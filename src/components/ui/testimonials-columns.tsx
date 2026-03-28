"use client"

import React from "react"
import { motion } from "motion/react"
import { Star } from "lucide-react"

export type Testimonial = {
  text: string
  name: string
  location: string
}

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration ?? 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[...Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            {props.testimonials.map((review, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-warm-surface bg-warm-white shadow-sm max-w-xs w-full"
              >
                {/* 5 stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-warm-text leading-relaxed">{review.text}</p>
                <div className="flex items-center gap-2.5 mt-4">
                  <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-warm-text leading-tight">
                      {review.name}
                    </span>
                    <span className="text-xs text-warm-muted">{review.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
