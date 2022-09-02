/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        'brand': '#e74c3c',
        'brand-dark': '#d52d1a',
        'brand-light': '#ec7669',
      }
    },
  },
  plugins: [],
}
