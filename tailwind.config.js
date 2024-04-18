/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'geist': ['"Geist Sans"', 'sans-serif'],
      'mona': ['"Mona Sans"', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        "custom-sm": "2px 3px 10px 0px rgba(255, 128, 0, 0.18);",
      },
      colors: {
        custom: {
          background: "var(--background)",
          "hover-primary":"var(--hover-primary)",
          "hover-state": "var(--hover-state)",
          stroke: "var(--stroke)",
          button:"var(--button)",
          "secondary-text": "var(--secondary-text)",
          "primary-text": "var(--primary-text)",
          accent: "var(--accent)",
          white: "#FAFAFA",
          black: "var(--black)",
          lightGrey: "#666666",
          brightOrange: {
            100: "#EC802F",
            200: "#ED8936",
            300: "#FAA739",
          },
          otherLight: "var(--other-light-text)"
        },
      },
      backgroundImage: {
        gradient: "var(--gradient)",
        "shadow-left":"var(--shadow-left)",
        "shadow-right":"var(--shadow-right)",
      },
    },
  },
  plugins: [],
};
