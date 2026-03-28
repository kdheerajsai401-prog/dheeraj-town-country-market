import { cn } from "@/lib/utils"

type SectionWrapperProps = {
  as?: "section" | "div" | "article"
  className?: string
  innerClassName?: string
  children: React.ReactNode
}

export function SectionWrapper({
  as: Tag = "section",
  className,
  innerClassName,
  children,
}: SectionWrapperProps) {
  return (
    <Tag className={cn("w-full", className)}>
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", innerClassName)}>
        {children}
      </div>
    </Tag>
  )
}
