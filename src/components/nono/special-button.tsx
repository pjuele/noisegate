import { cn } from "@/lib/utils"
import type { NavLinkItem } from "./types"

interface SpecialButtonProps {
  item: NavLinkItem
  variant?: "outline" | "filled"
  className?: string
}

export function SpecialButton({ item, variant = "outline", className }: SpecialButtonProps) {
  const { href, label, icon: Icon } = item

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5",
        "text-xs font-mono tracking-tight",
        "transition-colors",
        variant === "filled"
          ? "bg-primary text-primary-foreground hover:bg-(--nono-accent-hover)"
          : "border border-border text-foreground hover:bg-(--nono-surface-hover)",
        className
      )}
    >
      {Icon && <Icon size={14} />}
      {label}
    </a>
  )
}
