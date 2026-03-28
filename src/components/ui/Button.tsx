import Link from "next/link"
import { cn } from "@/lib/utils"

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  href?: string
  external?: boolean
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-pill transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"

  const variants = {
    primary: "bg-teal text-white hover:bg-teal-dark",
    secondary:
      "border border-warm-text text-warm-text hover:bg-warm-text hover:text-warm-white",
    ghost: "text-warm-text hover:bg-warm-surface",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  }

  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
