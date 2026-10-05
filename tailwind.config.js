/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'win-gray': '#c0c0c0',
        'win-blue': '#000080',
        'y2k-pink': '#ff00ff',
        'y2k-green': '#00ff00',
      },
      boxShadow: {
        'win-out': 'inset 1px 1px 0px #ffffff, inset -1px -1px 0px #0a0a0a, inset 2px 2px 0px #dfdfdf, inset -2px -2px 0px #808080',
        'win-in': 'inset 1px 1px 0px #0a0a0a, inset -1px -1px 0px #ffffff, inset 2px 2px 0px #808080, inset -2px -2px 0px #dfdfdf',
      }
    },
  },
  plugins: [],
}
