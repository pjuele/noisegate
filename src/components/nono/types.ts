export interface NavLinkItem {
  href: string
  label: string
  icon?: React.ComponentType<{ size?: number }>
  tooltip?: string  // falls back to label if absent
}
