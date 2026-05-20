import { NavBar } from "./nav-bar"
import { SocialLink } from "./social-link"
import { SpecialButton } from "./special-button"
import { ThemeToggle } from "./theme-toggle"
import { HamburgerMenu } from "./hamburger-menu"
import { cn } from "@/lib/utils"
import type { NavLinkItem } from "./types"

interface HouseStyleNavBarProps {
  /** Brand name or logo element shown on the left */
  brand: React.ReactNode
  /** Center nav links — rendered as uppercase monospace text, with optional icon */
  navLinks?: NavLinkItem[]
  /** Icon-only social links rendered on the right before the theme toggle */
  socialLinks?: NavLinkItem[]
  /** Optional outlined button at the far right (e.g. GitHub, Docs) */
  ctaButton?: NavLinkItem
  /** Show the dark/light theme toggle. Defaults to true. */
  showThemeToggle?: boolean
  className?: string
}

export function HouseStyleNavBar({
  brand,
  navLinks = [],
  socialLinks = [],
  ctaButton,
  showThemeToggle = true,
  className,
}: HouseStyleNavBarProps) {
  return (
    <NavBar className={className}>
      <NavBar.Left>
        <span className="text-sm font-bold tracking-tight font-mono">
          {brand}
        </span>
      </NavBar.Left>

      {navLinks.length > 0 && (
        <NavBar.Center className="hidden md:flex">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5",
                "text-xs uppercase tracking-wider font-mono",
                "text-muted-foreground hover:text-foreground",
                "transition-colors"
              )}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </a>
          ))}
        </NavBar.Center>
      )}

      <NavBar.Right>
        {socialLinks.map((item) => (
          <SocialLink key={item.label} item={item} />
        ))}
        {showThemeToggle && <ThemeToggle />}
        {ctaButton && <SpecialButton item={ctaButton} className="hidden md:flex" />}
        {navLinks.length > 0 && (
          <HamburgerMenu
            navLinks={navLinks}
            socialLinks={socialLinks}
            className="md:hidden"
          />
        )}
      </NavBar.Right>
    </NavBar>
  )
}
