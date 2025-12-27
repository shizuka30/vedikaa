// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#E11D85',
        'primary-dark': '#C3136F',
        'secondary': '#FFD700', // A golden color for the highlight
      }
    },
  },
  plugins: [],
}