import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { NavLinkItem } from "./types"

interface SocialLinkProps {
  item: NavLinkItem
  className?: string
}

export function SocialLink({ item, className }: SocialLinkProps) {
  const { href, label, icon: Icon, tooltip } = item

  const link = (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "w-8 h-8 flex items-center justify-center",
        "text-foreground/60 hover:text-foreground",
        "transition-colors",
        className
      )}
    >
      {Icon && <Icon size={16} />}
    </a>
  )

  if (!Icon) return link

  return (
    <Tooltip>
      <TooltipTrigger>{link}</TooltipTrigger>
      <TooltipContent>
        <p>{tooltip ?? label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
