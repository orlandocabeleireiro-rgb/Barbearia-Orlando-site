import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1F2A3A',
        abyss: '#0E141D',
        barber: '#A8322D',
        cream: '#EDE3CC',
        brass: '#B8925A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        label: ['"Barlow Condensed"', 'Arial Narrow', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.045em', label: '0.32em' },
    },
  },
} satisfies Config
