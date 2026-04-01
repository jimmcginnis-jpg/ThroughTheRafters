/** @type {import('tailwindcss').Config} */
const school = require('./school.config');

module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        school: {
          primary: school.colors.primary,
          accent: school.colors.accent,
          accentLight: school.colors.accentLight,
          dark: school.colors.dark,
          cream: school.colors.cream,
          text: school.colors.text,
        },
      },
      fontFamily: {
        display: [school.fonts.display, school.fonts.displayFallback],
        body: [school.fonts.body, school.fonts.bodyFallback],
        mono: [school.fonts.mono, school.fonts.monoFallback],
      },
    },
  },
  plugins: [],
};
