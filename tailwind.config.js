module.exports = {
  purge: [],
  darkMode: "class", // or 'media' or 'class'
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    options: {
      safelist: ["bg-line-M1", "bg-line-M2", "bg-line-M3", "bg-line-M5"],
    },
  },
  theme: {
    extend: {
      colors: {
        primary: "#f48325",
        "line-M1": "#E31D1A",
        "line-M2": "#638B18",
        "line-M3": "#F6A704",
        "line-M5": "#9778D3",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
