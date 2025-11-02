/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#F4D03F",
          cyan: "#00BFFF",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Chivo'", "'Inter'", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glowGold: "0 0 45px rgba(244,208,63,0.25)",
        glowCyan: "0 0 40px rgba(0,191,255,0.3)",
        panel: "0 0 60px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
}
