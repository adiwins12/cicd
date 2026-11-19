/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf7',
          100: '#f7f1e6',
          200: '#edd9ba',
          300: '#e1be88',
          400: '#d5a159',
          500: '#c58634',
          600: '#a76a26',
          700: '#844f21',
          800: '#6d4021',
          900: '#5a351f',
        },
        rosewood: {
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f7d5db',
          300: '#f0b4bf',
          400: '#e4889a',
          500: '#d45f77',
          600: '#be415b',
          700: '#9f3248',
          800: '#842c3e',
          900: '#712937',
        },
        champagne: '#f8f4eb',
        ivory: '#fffff8',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Great Vibes', 'cursive'],
      },
      boxShadow: {
        'wedding': '0 10px 30px -10px rgba(197, 134, 52, 0.25)',
        'luxury': '0 20px 40px -15px rgba(113, 41, 55, 0.2)',
      }
    },
  },
  plugins: [],
}
