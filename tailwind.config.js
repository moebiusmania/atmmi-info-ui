/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  ],
  safelist: ["bg-line-M1", "bg-line-M2", "bg-line-M3", "bg-line-M4", "bg-line-M5"],
  theme: {
    extend: {
      colors: {
        primary: "#f48325",
        "line-M1": "#E31D1A",
        "line-M2": "#638B18",
        "line-M3": "#F6A704",
        "line-M4": "#1F3E6D",
        "line-M5": "#9778D3",
      },
    },
  },
  plugins: [require("daisyui")],
}
