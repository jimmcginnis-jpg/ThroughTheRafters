/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        uk: {
          blue: '#0033A0',
          blueDark: '#001A50',
          white: '#FFFFFF',
          silver: '#C8C9C7',
          cream: '#F5F7FA',
          slate: '#0033A0',
        },
      },
      fontFamily: {
        display: ['Oswald', 'Arial', 'sans-serif'],
        body: ['Source Sans 3', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
