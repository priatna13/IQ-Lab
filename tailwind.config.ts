import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          navy: "#0f2744",
          "navy-soft": "#1a3a5c",
          teal: "#0d9488",
          "teal-deep": "#0f766e",
          mint: "#ccfbf1",
          warm: "#ea580c",
          coral: "#fb7185",
          sun: "#fbbf24",
          sky: "#38bdf8",
          violet: "#8b5cf6",
          cream: "#fff7ed",
          mist: "#f0f9ff",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 39, 68, 0.08)",
        lift: "0 12px 40px -12px rgba(13, 148, 136, 0.22)",
        glow: "0 0 0 4px rgba(13, 148, 136, 0.15)",
      },
      borderRadius: {
        "2.5xl": "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "bar-in": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-up-1": "fade-up 0.5s ease-out 0.06s both",
        "fade-up-2": "fade-up 0.5s ease-out 0.12s both",
        "fade-up-3": "fade-up 0.5s ease-out 0.18s both",
        float: "float 5s ease-in-out infinite",
        "bar-in": "bar-in 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
