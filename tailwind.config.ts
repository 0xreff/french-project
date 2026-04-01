import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:         'var(--color-bg)',
        surface:    'var(--color-surface)',
        accent:     'var(--color-accent)',
        'accent-2': 'var(--color-accent-2)',
        text:       'var(--color-text)',
        muted:      'var(--color-muted)',
        gallery:    'var(--color-gallery-bg)',
      },
      fontFamily: {
        /* Both aliases now resolve to Inter / Apple system stack */
        display: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text',    'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.20em',
        widest3: '0.28em',
      },
      fontWeight: {
        thin:       '300',
        regular:    '400',
        medium:     '500',
        semibold:   '600',
        bold:       '700',
      },
    },
  },
  plugins: [],
}
export default config
