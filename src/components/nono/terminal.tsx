import { cn } from "@/lib/utils"

interface TerminalProps {
  children: React.ReactNode
  className?: string
  /** Prompt prefix shown before the first line, e.g. "$" or ">" */
  prompt?: string
}

export function Terminal({ children, className, prompt }: TerminalProps) {
  return (
    <div
      className={cn(
        "bg-(--nono-terminal-bg) text-(--nono-terminal-text)",
        "border border-border",
        "px-4 py-3 font-mono text-sm leading-relaxed",
        className
      )}
    >
      {prompt ? (
        <span>
          <span className="text-muted-foreground select-none mr-2">{prompt}</span>
          {children}
        </span>
      ) : (
        children
      )}
    </div>
  )
}
