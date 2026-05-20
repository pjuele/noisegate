"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavBar } from "./nav-bar"
import { SocialLink } from "./social-link"
import { SpecialButton } from "./special-button"
import { ThemeToggle } from "./theme-toggle"
import { HamburgerMenu } from "./hamburger-menu"
import { cn } from "@/lib/utils"
import type { NavLinkItem } from "./types"

interface HouseStyleNavBarProps {
  /**
   * Brand element shown on the left — typically a logo or wordmark.
   * Wrap in a <Link href="/"> in the caller if you want it to be clickable.
   */
  brand: React.ReactNode

  /**
   * Center nav links shown as uppercase monospace text on desktop (md+).
   * On mobile these are hidden and moved into the hamburger menu automatically.
   * The currently active link is highlighted using the current pathname.
   * Example: [{ href: '/world', label: 'world' }, { href: '/', label: 'la celeste' }]
   */
  navLinks?: NavLinkItem[]

  /**
   * Icon-only social links shown on the right (e.g. GitHub, Twitter).
   * Also included in the hamburger menu on mobile.
   * Example: [{ href: 'https://github.com/foo', label: 'GitHub', icon: GithubIcon }]
   */
  socialLinks?: NavLinkItem[]

  /**
   * Optional outlined CTA button at the far right, hidden on mobile.
   * Example: { href: '/docs', label: 'Docs' }
   */
  ctaButton?: NavLinkItem

  /**
   * Extra elements rendered in the right slot on desktop (hidden on mobile).
   * Use for app-specific controls that belong in the navbar on desktop —
   * e.g. a language selector: rightExtras={<LangToggle />}
   * Pair with hamburgerExtras to show the same control inside the mobile menu.
   */
  rightExtras?: React.ReactNode

  /**
   * Extra content rendered inside the hamburger menu on mobile.
   * Use to expose controls that are hidden from the navbar on mobile —
   * e.g. hamburgerExtras={<LangToggle />}
   */
  hamburgerExtras?: React.ReactNode

  /**
   * Show the dark/light theme toggle. Defaults to true.
   * Set to false if the app manages its own theme UI via rightExtras.
   */
  showThemeToggle?: boolean

  className?: string
}

export function HouseStyleNavBar({
  brand,
  navLinks = [],
  socialLinks = [],
  ctaButton,
  rightExtras,
  hamburgerExtras,
  showThemeToggle = true,
  className,
}: HouseStyleNavBarProps) {
  const pathname = usePathname()

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
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5",
                "text-xs uppercase tracking-wider font-mono",
                "transition-colors",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </Link>
          ))}
        </NavBar.Center>
      )}

      <NavBar.Right>
        {socialLinks.map((item) => (
          <SocialLink key={item.label} item={item} />
        ))}
        {rightExtras && <div className="hidden md:flex items-center gap-1">{rightExtras}</div>}
        {showThemeToggle && <ThemeToggle />}
        {ctaButton && <SpecialButton item={ctaButton} className="hidden md:flex" />}
        {navLinks.length > 0 && (
          <HamburgerMenu
            navLinks={navLinks}
            socialLinks={socialLinks}
            extras={hamburgerExtras}
            className="md:hidden"
          />
        )}
      </NavBar.Right>
    </NavBar>
  )
}
