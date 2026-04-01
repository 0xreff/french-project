import { useState, useEffect, useRef } from 'react'

interface PreloaderState {
  images: HTMLImageElement[]
  loaded: boolean
  progress: number    // 0-1
}

/**
 * Preloads a sequence of images into memory.
 * @param basePath  e.g. '/sequence-1/'
 * @param count     total number of frames
 * @param pad       zero-pad width (default 4 → '0001.jpg')
 * @param ext       file extension (default 'jpg')
 */
export function useImagePreloader(
  basePath: string,
  count: number,
  pad = 4,
  ext = 'jpg'
): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    images: [],
    loaded: false,
    progress: 0,
  })
  const cache = useRef<Map<string, HTMLImageElement>>(new Map())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const urls = Array.from({ length: count }, (_, i) => {
      const n = String(i + 1).padStart(pad, '0')
      return `${basePath}${n}.${ext}`
    })

    let loadedCount = 0
    const images: HTMLImageElement[] = new Array(count)

    urls.forEach((url, i) => {
      if (cache.current.has(url)) {
        images[i] = cache.current.get(url)!
        loadedCount++
        if (loadedCount === count) {
          setState({ images, loaded: true, progress: 1 })
        }
        return
      }

      const img = new Image()
      img.src = url
      img.onload = () => {
        cache.current.set(url, img)
        images[i] = img
        loadedCount++
        setState((prev) => ({
          ...prev,
          progress: loadedCount / count,
          loaded: loadedCount === count,
          images: loadedCount === count ? [...images] : prev.images,
        }))
      }
      img.onerror = () => {
        // skip broken frame gracefully
        loadedCount++
        setState((prev) => ({
          ...prev,
          progress: loadedCount / count,
          loaded: loadedCount === count,
        }))
      }
    })
  }, [basePath, count, pad, ext])

  return state
}
