export interface MuseumItem {
  id: string
  halfTitle: string
  title: string
  paragraph: string
  year: string
  medium: string
  imageSrc?: string
}

export interface FrameSequence {
  basePath: string
  totalFrames: number
  padWidth?: number
  ext?: string
}
