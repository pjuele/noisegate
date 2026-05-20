"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { NavLinkItem } from "./types"

interface HamburgerMenuProps {
  navLinks?: NavLinkItem[]
  socialLinks?: NavLinkItem[]
  /**
   * Extra content rendered at the bottom of the menu, above social links.
   * Use for app-specific controls that the menu shouldn't know about —
   * e.g. a language selector: extras={<LangToggle />}
   */
  extras?: React.ReactNode
  className?: string
}

export function HamburgerMenu({
  navLinks = [],
  socialLinks = [],
  extras,
  className,
}: HamburgerMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className={cn(
          "w-8 h-8 flex items-center justify-center",
          "text-foreground/60 hover:text-foreground transition-colors",
          className
        )}
      >
        <Menu size={18} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full sm:w-80 bg-background border-l border-border p-0 flex flex-col"
        >
          <SheetHeader className="flex flex-row items-center justify-between px-6 h-12 border-b border-border shrink-0">
            <SheetTitle className="text-sm font-mono font-medium text-foreground">
              Menu
            </SheetTitle>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </SheetHeader>

          <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 py-3",
                  "text-sm font-mono text-muted-foreground hover:text-foreground",
                  "border-b border-border last:border-0",
                  "transition-colors"
                )}
              >
                {item.icon && <item.icon size={14} />}
                {item.label}
              </a>
            ))}
            {extras && (
              <div className="pt-4" onClick={() => setOpen(false)}>
                {extras}
              </div>
            )}
          </nav>

          {socialLinks.length > 0 && (
            <div className="px-6 pb-8 flex items-center gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                >
                  {item.icon && <item.icon size={16} />}
                </a>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
