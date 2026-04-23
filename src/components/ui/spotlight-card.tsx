"use client"

import React, { useEffect, useRef, ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange'
  size?: 'sm' | 'md' | 'lg'
  width?: string | number
  height?: string | number
  customSize?: boolean
  noBg?: boolean
}

const glowColorMap = {
  blue:   { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green:  { base: 120, spread: 200 },
  red:    { base: 0,   spread: 200 },
  orange: { base: 30,  spread: 200 },
}

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
}

// ── Module-level shared pointer tracker ─────────────────────────────────────
// Previously every GlowCard mounted its own document-level pointermove
// listener and wrote --x/--y onto its own element. With 1,000+ cards that
// created 1,000+ identical listeners firing on every mouse move. Since the
// values written were always the same global viewport coordinates, we now
// install ONE listener and write to document.documentElement — every card
// inherits via CSS var() resolution, behavior identical, cost O(1).

let pointerListenerInstalled = false

function installSharedPointerListener(): void {
  if (pointerListenerInstalled) return
  if (typeof window === 'undefined') return
  // Skip on touch devices — preserves existing scroll-jank protection
  if (window.matchMedia('(pointer: coarse)').matches) return

  const root = document.documentElement
  const onMove = (e: PointerEvent) => {
    const x = e.clientX
    const y = e.clientY
    root.style.setProperty('--x', x.toFixed(2))
    root.style.setProperty('--xp', (x / window.innerWidth).toFixed(2))
    root.style.setProperty('--y', y.toFixed(2))
    root.style.setProperty('--yp', (y / window.innerHeight).toFixed(2))
  }
  document.addEventListener('pointermove', onMove, { passive: true })
  pointerListenerInstalled = true
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  noBg = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Idempotent — first mounted card installs the singleton, rest no-op.
    installSharedPointerListener()
  }, [])

  const { base, spread } = glowColorMap[glowColor]

  const getSizeClasses = () => {
    if (customSize) return ''
    return sizeMap[size]
  }

  const getInlineStyles = () => {
    const baseStyles: Record<string, string | number> = {
      '--base': base,
      '--spread': spread,
      '--radius': '14',
      '--border': '2',
      // Theme-aware via CSS vars in globals.css:
      // Light: --glow-lightness=30 → after brightness(2)=60% vivid, --glow-backdrop=white
      // Dark:  --glow-lightness=50 → after brightness(2)=100% white glow on dark, --glow-backdrop=#1c1b18
      '--lightness': 'var(--glow-lightness, 30)',
      '--saturation': '100',
      '--bg-spot-opacity': noBg ? '0' : '0.08',
      '--backdrop': 'var(--glow-backdrop, hsl(0 0% 100%))',
      '--backup-border': 'var(--glow-border, hsl(0 0% 88%))',
      '--size': '300',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 30) * 1%) / var(--bg-spot-opacity, 0.08)), transparent
      )`,
      ...(noBg ? {} : { backgroundColor: 'var(--backdrop, transparent)' }),
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      backgroundAttachment: 'fixed',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative',
      touchAction: 'pan-y',
    }
    if (width !== undefined) baseStyles.width = typeof width === 'number' ? `${width}px` : width
    if (height !== undefined) baseStyles.height = typeof height === 'number' ? `${height}px` : height
    return baseStyles
  }

  // The [data-glow]::before / ::after / nested [data-glow] styles previously
  // injected here via dangerouslySetInnerHTML are now in src/app/globals.css.
  // No per-card <style> tag is rendered — saves N inline stylesheets.

  return (
    <div
      ref={cardRef}
      data-glow
      style={getInlineStyles() as React.CSSProperties}
      className={`
        ${getSizeClasses()}
        ${!customSize ? 'aspect-[3/4]' : ''}
        rounded-2xl
        relative
        grid
        grid-rows-[1fr_auto]
        shadow-[0_2px_16px_rgba(0,0,0,0.08)]
        p-4
        gap-4
        backdrop-blur-[5px]
        ${className}
      `}
    >
      <div ref={innerRef} data-glow></div>
      {children}
    </div>
  )
}

export { GlowCard }
