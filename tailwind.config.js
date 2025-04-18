import { heroui } from "@heroui/react";
import scrollbar from "tailwind-scrollbar";

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
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    scrollbar(),
    heroui({
      themes: {
        dark: {
          extend: "dark", // <- inherit default values from dark theme
          colors: {
            primary: {
              50: "#f7ffe6",
              100: "#ecffbf",
              200: "#d8ff80",
              300: "#c4ff40",
              400: "#b4ff0d",
              500: "#aaff00",
              600: "#99e600",
              700: "#7fcc00",
              800: "#66b300",
              900: "#4d9900",
              DEFAULT: "#AAFF00",
              foreground: "#000",
            },
            secondary: {
              DEFAULT: "#9B30FF",
              foreground: "#000",
            },
            content1: {
              DEFAULT: "#010101",
            },
            divider: {
              DEFAULT: "#777",
            },
            focus: {
              DEFAULT: "#AAFF00",
            },
            default: {
              DEFAULT: "#010101",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};

/**
 * #211C84
 * #4D55CC
 * #7A73D1
 * #B5A8D5
 */
