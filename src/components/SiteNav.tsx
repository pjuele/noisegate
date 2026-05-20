'use client'

import Link from 'next/link'
import { NoiseGateWordmark } from '@/components/Logo'
import { HouseStyleNavBar } from '@/components/nono'
import { LangToggle } from '@/components/LangToggle'

const NAV_LINKS = [
  { href: '/world', label: 'world' },
  { href: '/uruguay', label: 'uruguay' },
  { href: '/', label: 'la celeste' }, // TODO: move to /celeste once that page is implemented
]

export function SiteNav() {
  return (
    <HouseStyleNavBar
      brand={
        <Link href="/">
          <NoiseGateWordmark className="h-6 w-auto" />
        </Link>
      }
      navLinks={NAV_LINKS}
      rightExtras={<LangToggle />}
      hamburgerExtras={<LangToggle />}
    />
  )
}
