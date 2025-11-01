const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./mdx-components.tsx",
    "content/**/*.mdx",
  ],

  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '"',
            },
            "code::after": {
              content: '"',
            },
          },
        },
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": {
              content: "none",
            },
            "blockquote p:first-of-type::after": {
              content: "none",
            },
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-calsans)"],
        dm: ["var(--font-dm_sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // require("tailwindcss-debug-screens"), // Temporarily disabled for v4 upgrade
    require("tailwindcss-animate"),
  ],
};
