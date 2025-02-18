/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        background_dark: "#0a0d14",
        background_dark_secondary: "#101520",
        background_light: "#FFF2F2",
        // background_light_secondary: "#be92ee",
        background_light_secondary: "#E4E0E1",
        text_dark: "#d8b4fe",
        text_dark_secondary: "#7e22ce",
        text_light: "#0a0d14",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
};
