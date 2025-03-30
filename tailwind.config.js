import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          extend: "dark", // <- inherit default values from dark theme
          colors: {
            /**
             *  #FF9100 (Orange)
             *  #AAFF00 (Lime)
             */
            primary: {
              DEFAULT: "#FF9100",
            },
            secondary: {
              DEFAULT: "#AAFF00",
            },
            content1: {
              DEFAULT: "#010101",
            },
            divider: {
              DEFAULT: "#555",
            },
            focus: {
              DEFAULT: "#AAFF00",
            },
          },
        },
      },
    }),
  ],
};
