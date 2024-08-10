/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      animation: {
        blink: "blink 1s ease-in infinite",
        "fade-in": "fade-in 0.3s ease-in",
        "marquee-horizontal": "marquee-horizontal linear infinite",
        "marquee-vertical": "marquee-vertical linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "slide-down": "slideDown ease-in 0.3s",
        "slide-down-fade": "slideDownFade ease-in",
        "slide-left": "slideLeft linear 0.3s",
        "slide-right": "slideRight linear 0.3s",
        "slide-up": "slideUp ease-in 0.3s",
        "slide-up-fade": "slideUpFade ease-in",
      },
      backgroundImage: {
        shimmer:
          "linear-gradient(-45deg, rgba(255,255,255,0) 43%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 57%)",
      },
      colors: {
        "clr-accent": "rgb(var(--clr-accent) / <alpha-value>)",
        "clr-bg": "rgb(var(--clr-bg) / <alpha-value>)",
        "clr-bg-surface": "rgb(var(--clr-bg-surface) / <alpha-value>)",
        "clr-border": "rgb(var(--clr-border) / <alpha-value>)",
        "clr-text": "rgb(var(--clr-text) / <alpha-value>)",
        "clr-text-inverted": "rgb(var(--clr-text-inverted) / <alpha-value>)",
      },
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
        shimmer: {
          "0%": { "background-position-x": "200%" },
          "100%": { "background-position-x": "0%" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideDownFade: {
          "0%": { transform: "translateY(-100%)", opacity: 1 },
          "90%": { transform: "translateY(0)", opacity: 0.25 },
          "100%": { transform: "translateY(0)", opacity: 0 },
        },
        slideLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideUpFade: {
          "0%": { transform: "translateY(100%)", opacity: 1 },
          "90%": { transform: "translateY(0)", opacity: 0.25 },
          "100%": { transform: "translateY(0)", opacity: 0 },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const baseRing = {
        outline: "none",
        "&:focus": {
          outline: "none",
        },
      };

      const newUtilities = {
        ".focus-ring": {
          ...baseRing,
          "&:focus-visible": {
            outline: "2px solid rgb(var(--clr-accent))",
            "outline-offset": "2px",
            borderRadius: "0.25rem", // equivalent to rounded-md
          },
        },
        ".focus-ring-inner": {
          ...baseRing,
          "&:focus-visible": {
            outline: "2px solid rgb(var(--clr-accent))",
            "outline-offset": "-1px",
            borderRadius: "0.25rem", // equivalent to rounded-md
          },
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
