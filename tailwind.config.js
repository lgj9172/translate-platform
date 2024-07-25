/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF824C",
      },
      fontFamily: {
        sans: ["var(--font-spoqa-han-sans-neo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
