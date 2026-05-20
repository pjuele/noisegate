'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NoiseGateWordmark } from '@/components/Logo'
import { NavBar, ThemeToggle } from '@/components/nono'
import { LangToggle } from '@/components/LangToggle'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/world', label: 'world' },
  { href: '/uruguay', label: 'uruguay' },
  { href: '/', label: 'la celeste' }, // TODO: move to /celeste once that page is implemented
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <NavBar>
      <NavBar.Left>
        <Link href="/">
          <NoiseGateWordmark className="h-6 w-auto" />
        </Link>
      </NavBar.Left>
      <NavBar.Center>
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center px-3 py-1.5 text-xs uppercase tracking-wider font-mono transition-colors',
              pathname === href
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </Link>
        ))}
      </NavBar.Center>
      <NavBar.Right>
        <LangToggle />
        <ThemeToggle />
      </NavBar.Right>
    </NavBar>
  )
}
