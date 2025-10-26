/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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
        'secondary-glow': 'rgba(2, 132, 199, 0.2)',
        'text-primary': '#111827',
        'text-secondary': '#374151',
        'text-tertiary': '#6B7280'
      },
      spacing: {
        '4.5': '1.125rem',
        '8.5': '2.125rem',
        '12.5': '3.125rem',
        '14.5': '3.625rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.7' }],
        '2xl': ['1.5rem', { lineHeight: '1.8' }],
        '3xl': ['1.875rem', { lineHeight: '1.8' }],
        '4xl': ['2.25rem', { lineHeight: '1.9' }],
        '5xl': ['3rem', { lineHeight: '1.9' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }]
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            h1: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '2.25rem',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              marginBottom: '1.5rem'
            },
            h2: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '1.875rem',
              fontWeight: '700',
              letterSpacing: '-0.01em',
              lineHeight: '1.3',
              marginTop: '1.5rem',
              marginBottom: '1rem'
            },
            h3: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '1.5rem',
              fontWeight: '600',
              letterSpacing: '0em',
              lineHeight: '1.4',
              marginTop: '1.25rem',
              marginBottom: '0.75rem'
            },
            h4: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.5',
              marginTop: '1rem',
              marginBottom: '0.5rem'
            },
            p: {
              lineHeight: '1.7',
              letterSpacing: '0.01em',
              marginBottom: '1.25rem'
            },
            a: {
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            ul: {
              listStylePosition: 'inside'
            }
          }
        }
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hover': '0 20px 25px -5px rgba(30, 58, 138, 0.15)',
        'focus': '0 0 0 3px rgba(30, 58, 138, 0.1)'
      },
      animation: {
        'border-spin': 'border-spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce': 'bounce 1.5s infinite',
        'pulse-down': 'pulseDown 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        'border-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(10px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        pulseDown: {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.9'
          },
          '50%': {
            transform: 'translateY(12px)',
            opacity: '1'
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
