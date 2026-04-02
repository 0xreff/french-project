import type Lenis from '@studio-freight/lenis'

export function useSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null
  return (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).__lenis ?? null
}
