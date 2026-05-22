/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        cream: {
          50: '#fdfcf8',
          100: '#faf6ee',
          200: '#f4ead8',
          300: '#ead6b8',
        },
        sage: {
          400: '#8aab8a',
          500: '#6b9468',
          600: '#4e7a4b',
          700: '#3a5e38',
        },
        blush: {
          300: '#e8b4b8',
          400: '#d9848a',
          500: '#c45c64',
        },
        ink: {
          900: '#1a1a1a',
          800: '#2d2d2d',
          700: '#444444',
          500: '#737373',
          300: '#b0b0b0',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      }
    },
  },
  plugins: [],
}
