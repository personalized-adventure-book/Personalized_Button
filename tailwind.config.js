/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF7A00",
        secondary: {
          blue: "#0055FF",
          purple: "#9C27B0",
          green: "#4CAF50",
          yellow: "#FFC107",
          pink: "#E91E63",
        },
      },
      fontFamily: {
        "cal-sans": ["Cal Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 1s ease-in-out",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.1)",
        "soft-dark": "0 4px 12px rgba(0, 0, 0, 0.3)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
