import type Lenis from '@studio-freight/lenis'

export function useSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null
  return (window as any).__lenis ?? null
}
