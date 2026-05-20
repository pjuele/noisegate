import { cn } from "@/lib/utils"

interface NavBarSlotProps {
  children: React.ReactNode
  className?: string
}

function NavBarLeft({ children, className }: NavBarSlotProps) {
  return (
    <div className={cn("flex items-center shrink-0", className)}>{children}</div>
  )
}

function NavBarCenter({ children, className }: NavBarSlotProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>{children}</div>
  )
}

function NavBarRight({ children, className }: NavBarSlotProps) {
  return (
    <div className={cn("flex items-center gap-1 shrink-0", className)}>{children}</div>
  )
}

interface NavBarProps {
  children: React.ReactNode
  className?: string
}

export function NavBar({ children, className }: NavBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-background border-b border-border",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between gap-2">
        {children}
      </div>
    </header>
  )
}

NavBar.Left = NavBarLeft
NavBar.Center = NavBarCenter
NavBar.Right = NavBarRight
