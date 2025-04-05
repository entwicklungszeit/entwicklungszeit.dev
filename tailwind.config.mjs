/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#0284C7',
        'primary-glow': 'rgba(30, 58, 138, 0.2)',
        'secondary-glow': 'rgba(2, 132, 199, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        'great-vibes': ['Great Vibes', 'cursive'],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: 'Fraunces, serif',
              letterSpacing: '0.04em',
            },
            h2: {
              fontFamily: 'Fraunces, serif',
              letterSpacing: '0.04em',
            },
            h3: {
              fontFamily: 'Fraunces, serif',
              letterSpacing: '0.04em',
            },
            h4: {
              fontFamily: 'Fraunces, serif',
              letterSpacing: '0.04em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}