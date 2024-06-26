/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#55B4C8",
        primary_dark: "#3E8FA9",
        secondary: "#10ac84",
        secondary_dark: "#0e8e6f",
      },
    },
  },
  plugins: [],
};
