/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#0284C7',
        'primary-light': '#3B82F6',
        'primary-dark': '#1E40AF',
        'secondary-light': '#38BDF8',
        'secondary-dark': '#0369A1',
        tertiary: '#8B5CF6',
        'primary-glow': 'rgba(30, 58, 138, 0.2)',
        'secondary-glow': 'rgba(2, 132, 199, 0.2)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        'great-vibes': ['Great Vibes', 'cursive']
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            h1: {
              fontFamily: 'Fraunces, serif',
              letterSpacing: '0.04em',
              lineHeight: '1.2'
            },
            h2: {
              fontFamily: 'Fraunces, serif',
              letterSpacing: '0.04em',
              lineHeight: '1.3'
            },
            h3: {
              fontFamily: 'Fraunces, serif',
              letterSpacing: '0.04em',
              lineHeight: '1.4'
            },
            h4: {
              fontFamily: 'Fraunces, serif',
              letterSpacing: '0.04em',
              lineHeight: '1.5'
            },
            p: {
              lineHeight: '1.7',
              letterSpacing: '0.01em'
            },
            a: {
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          }
        }
      },
      animation: {
        'border-spin': 'border-spin 20s linear infinite',
        float: 'float 6s ease-in-out infinite'
      },
      keyframes: {
        'border-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
