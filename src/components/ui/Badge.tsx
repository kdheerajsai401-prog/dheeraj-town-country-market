import { cn } from "@/lib/utils"

type BadgeProps = {
  variant?: "default" | "dark" | "green" | "sale" | "outline"
  className?: string
  children: React.ReactNode
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  const variants = {
    default: "bg-warm-surface text-warm-muted",
    dark: "bg-onyx-raised text-cream border border-cream/10",
    green: "bg-leaf/10 text-leaf",
    sale: "bg-sale text-white",
    outline: "border border-warm-text/20 text-warm-muted",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-pill text-xs font-semibold tracking-wide uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
