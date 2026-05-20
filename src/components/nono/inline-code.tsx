import { cn } from "@/lib/utils"

interface InlineCodeProps {
  children: React.ReactNode
  className?: string
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        "bg-(--nono-code-bg) text-(--nono-code-text)",
        "border border-border",
        "px-1 py-0.5 text-sm font-mono",
        className
      )}
    >
      {children}
    </code>
  )
}
