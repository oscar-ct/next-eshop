/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

module.exports = {
  darkMode: 'class',
  // darkMode: "selector",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
      },
    },
  },
  plugins: [daisyui],
};
