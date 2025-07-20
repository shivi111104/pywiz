/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 30px 60px -15px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

