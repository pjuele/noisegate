import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  /** Removes the default max-width constraint */
  full?: boolean
}

export function Section({ children, className, id, full = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full px-6 py-20",
        !full && "max-w-4xl mx-auto",
        className
      )}
    >
      {children}
    </section>
  )
}
