/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "marquee-horizontal": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(calc(-100% - 2rem))" },
        },
        "marquee-vertical": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(calc(-100% - 2rem))" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: 1 },
          "90%": { transform: "translateY(0)", opacity: 0.25 },
          "100%": { transform: "translateY(0)", opacity: 0 },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: 1 },
          "90%": { transform: "translateY(0)", opacity: 0.25 },
          "100%": { transform: "translateY(0)", opacity: 0 },
        },
      },
      animation: {
        blink: "blink 1s ease-in infinite",
        "fade-in": "fade-in 0.3s ease-in",
        "marquee-horizontal": "marquee-horizontal linear infinite",
        "marquee-vertical": "marquee-vertical linear infinite",
        "slide-down": "slideDown ease-in",
        "slide-up": "slideUp ease-in",
      },
    },
  },
  plugins: [],
};
