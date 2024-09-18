import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: 'tw-',
  theme: {
    extend: {
      fontFamily: {
        nunito: 'var(--font-nunito_sans)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
          active: 'var(--secondary-active)',
        },
        card: {
          DEFAULT: 'var(--card)',
          active: 'var(--card-active)',
          text: 'var(--card-text)',
          foreground: 'var(--card-foreground)',
        },
        action: {
          DEFAULT: 'var(--action)',
          active: 'var(--action-active)',
        },
      },
    },
  },
  plugins: [],
}
export default config
