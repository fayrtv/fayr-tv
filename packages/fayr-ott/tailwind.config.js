/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sfproregular: ['SF-Pro-Regular', 'sans-serif'],
        sfprobold: ['SF-Pro-Bold', 'bold'],
        winnersansbold: ['Winner-Sans-Narrow-Bold', 'bold'],
      }
    },
  },
  plugins: [],
}
