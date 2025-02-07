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
        background_light: "#d8b4fe",
        text_dark: "#d8b4fe",
        text_light: "#0a0d14",
      },
    },
  },
  plugins: [],
};
