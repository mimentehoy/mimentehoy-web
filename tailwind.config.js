const tailwindTheme = require('./styles/tailwind.theme.js')

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: tailwindTheme.theme.extend
  },
  plugins: []
}
