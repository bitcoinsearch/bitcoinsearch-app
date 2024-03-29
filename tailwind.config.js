/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#FFFFFF",
      lightOrange: "#FFF0E0",
      brightOrange: {
        100: "#EC802F",
        200: "#ED8936",
        300: "#FAA739",
      },
      darkGray: {
        100: "#666666",
        200: "#4D4D4D",
        300: "#292929",
      },
      gray: "#BFBFBF",
    },
    extend: {
      boxShadow: {
        "custom-sm": "2px 3px 10px 0px rgba(255, 128, 0, 0.18);",
      },
      colors: {
        custom: {
          grey: {
            light: "#BFBFBF",
            dark: "#999999",
          },
          orange: {
            light: "#FFF0E0",
            dark: "#F7931A",
          },
          // white: "#F2F2F7",
          white: "#FAFAFA",
          black: {
            dark: "#292929",
            light: "#4D4D4D",
          },
          lightGrey: "#666666",
          brightOrange: {
            100: "#EC802F",
            200: "#ED8936",
          },
        },
      },
      backgroundImage: {
        "gradient-92": "linear-gradient(92deg, var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-search":
          "linear-gradient(137deg, rgba(232,120,43,1) 0%, rgba(232,120,43,1) 50%, rgba(246,167,63,1) 100%);",
      },
    },
  },
  plugins: [],
};
