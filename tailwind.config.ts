import type { Config } from "tailwindcss";

/**
 * TechSylph light design system — Slate & Emerald.
 * Tailwind v4 uses CSS-first config via @theme in app/globals.css;
 * this file helps IDEs and other tooling.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#059669",
          "green-dark": "#047857",
          "green-light": "#D1FAE5",
          accent: "#10B981",
          dark: "#0F172A",
          slate: "#1E293B",
        },
        surface: {
          0: "#FFFFFF",
          1: "#F8FAF9",
          2: "#F0FDF4",
          3: "#D1FAE5",
          border: "#E2E8E4",
        },
        "text-primary": "#111827",
        "text-secondary": "#374151",
        "text-muted": "#6B7280",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #059669 0%, #10B981 100%)",
      },
      boxShadow: {
        "card-sm": "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 16px rgba(5,150,105,0.10), 0 16px 40px rgba(5,150,105,0.07)",
        "card-highlight": "0 1px 3px rgba(5,150,105,0.07), 0 8px 24px rgba(5,150,105,0.07)",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
