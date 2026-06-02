/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#53D1F9',
          50: '#f0fcff',
          100: '#d4f4ff',
          200: '#a9e8ff',
          300: '#73d9ff',
          400: '#53D1F9',
          500: '#1fc1f3',
          600: '#0aa8d4',
          700: '#0884ab',
          800: '#066282',
          900: '#04425a',
        },
        white: '#ffffff',
        black: '#000000',
        dark: '#1a1a1a',
        surface: {
          light: '#f5f5f7',
          dark: '#272729',
          darker: '#1d1d1f',
        },
        accent: {
          DEFAULT: '#eb7690',
          light: '#f08ca0',
          dark: '#c44562',
        },
      },
      fontFamily: {
        sans: ['SF Pro Display', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'pill': '980px',
      },
      boxShadow: {
        'apple': '3px 5px 30px 0px rgba(0, 0, 0, 0.22)',
        'premium': '0 8px 40px rgba(0, 0, 0, 0.35)',
        'glow': '0 0 30px rgba(83, 209, 249, 0.15)',
        'glow-lg': '0 0 50px rgba(83, 209, 249, 0.2)',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'premium-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'premium-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}