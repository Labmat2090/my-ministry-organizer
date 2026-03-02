/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7f0',
          100: '#d5ecda',
          200: '#aed9b8',
          300: '#7dc095',
          400: '#4da571',
          500: '#2d8a52',
          600: '#1f6e3f',
          700: '#185530',
          800: '#113d22',
          900: '#0a2414',
        },
        gold: {
          400: '#f0b429',
          500: '#de911d',
          600: '#cb6e17',
        },
        surface: {
          50: '#fafaf8',
          100: '#f4f3ef',
          200: '#e8e6df',
          800: '#1c1c1a',
          900: '#111110',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.06)',
        'modal': '0 24px 64px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ring-fill': {
          '0%': { 'stroke-dashoffset': '251' },
          '100%': { 'stroke-dashoffset': 'var(--dash-offset)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out forwards',
        'ring-fill': 'ring-fill 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}