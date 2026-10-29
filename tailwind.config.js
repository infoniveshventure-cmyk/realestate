/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFBF7',
        ivory: '#F5F1ED',
        charcoal: '#1A1A1A',
        'text-dark': '#2D2D2D',
        'text-grey': '#6B6B6B',
        accent: '#C5A572',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
    },
  },
  plugins: [],
};
