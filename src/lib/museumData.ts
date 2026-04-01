export interface MuseumItem {
  id: string
  halfTitle: string    // e.g. "Oil on Canvas · 1887"
  title: string
  paragraph: string
  year: string
  medium: string
  imageSrc?: string    // path to artwork image in /public/artworks/
}

export const MUSEUM_ITEMS: MuseumItem[] = [
  {
    id: 'luminance-1',
    halfTitle: 'Andalusian School · 1891',
    title: 'The Golden Hour of Carthage',
    paragraph: 'Warm ochres dissolve into the haze of antiquity. Painted during the artist\'s decade in Tunis, this work distills the ephemeral quality of North African light into a single suspended moment.',
    year: '1891',
    medium: 'Oil on canvas',
    imageSrc: '/artworks/carthage.jpg',
  },
  {
    id: 'silence-2',
    halfTitle: 'Mediterranean Modernism · 1924',
    title: 'Silence at the Medina Gate',
    paragraph: 'An arresting study of threshold and shadow. The arch becomes both frame and subject — architecture distilled into pure geometry, drenched in the blue hour\'s last breath.',
    year: '1924',
    medium: 'Tempera on gesso panel',
    imageSrc: '/artworks/medina.jpg',
  },
  {
    id: 'garden-3',
    halfTitle: 'Post-Impressionist · 1936',
    title: 'The Bardo Gardens at Dusk',
    paragraph: 'Fractured light through jasmine canopy. This late work demonstrates the artist\'s mastery of dappled luminosity — a sensory record of the garden as memory, not place.',
    year: '1936',
    medium: 'Oil on linen',
    imageSrc: '/artworks/bardo.jpg',
  },
  {
    id: 'weave-4',
    halfTitle: 'Traditional Arts · 18th c.',
    title: 'Ceremonial Kilim — Feast of the Pleiades',
    paragraph: 'Woven from undyed Berber wool across three generations of hands. Each geometric motif encodes cosmological knowledge, a language legible to those who know where to look.',
    year: 'c. 1740–1780',
    medium: 'Wool on wool, natural dyes',
    imageSrc: '/artworks/kilim.jpg',
  },
  {
    id: 'portal-5',
    halfTitle: 'Zellige Installation · 2019',
    title: 'Infinite Portal — Commission I',
    paragraph: 'A contemporary response to the Arabesque tradition. Thousands of hand-cut ceramic tesserae form a pattern that expands without edge — infinity made tactile, silence made form.',
    year: '2019',
    medium: 'Glazed ceramic tesserae, steel armature',
    imageSrc: '/artworks/zellige.jpg',
  },
  {
    id: 'manuscript-6',
    halfTitle: 'Illuminated Manuscript · 14th c.',
    title: 'Codex of Celestial Correspondences',
    paragraph: 'Acquired from a private Fez collection, this rare folio page from a 14th-century astronomical treatise merges the empirical and the divine — stars mapped as theological argument.',
    year: 'c. 1340',
    medium: 'Ink and gold leaf on vellum',
    imageSrc: '/artworks/codex.jpg',
  },
]
