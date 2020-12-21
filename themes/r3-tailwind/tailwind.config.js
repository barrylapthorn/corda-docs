const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  purge: {
    content: [
      "**/*.html"
    ]
  },
  theme: {
    extend: {
      colors: {
        'r3-red': '#ec1d24',
        'r3-grey': '#53585f',
        'r3-black': '#010101',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
