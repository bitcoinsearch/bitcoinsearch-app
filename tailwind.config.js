/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
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
