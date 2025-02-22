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
        background_dark: "#010104",
        background_dark_secondary: "#171729",
        background_light: "#FBFBFE",
        background_light_secondary: "#DDDBFF",
        background_blue: "#2F27CE",
        //------------------------------------
        text_dark: "#EAE9FC",
        text_dark_secondary: "#221ACE",
        accent: "#3A31D8",
        text_light: "#0a0d14",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
};
