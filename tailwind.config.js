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
      },
    },
  },
  plugins: [],
}