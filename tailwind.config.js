module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'primary': '#f48325',
        'line-M1': '#E31D1A',
        'line-M2': '#638B18',
        'line-M3': '#F6A704',
        'line-M5': '#9778D3',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}
