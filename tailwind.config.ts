/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)",
        input: "var(--color-border)",
        ring: "var(--focus-outline-color)",
        background: "var(--color-background-body)",
        foreground: "var(--color-text-primary)",
        surface: "var(--color-background-surface)",
        primary: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-on-accent)",
        },
        secondary: {
          DEFAULT: "var(--color-background-muted)",
          foreground: "var(--color-text-primary)",
        },
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-on-error)",
        },
        muted: {
          DEFAULT: "var(--color-background-muted)",
          foreground: "var(--color-text-secondary)",
        },
        accent: {
          DEFAULT: "var(--color-accent-muted)",
          foreground: "var(--color-text-primary)",
        },
        popover: {
          DEFAULT: "var(--color-background-popover)",
          foreground: "var(--color-text-primary)",
        },
        card: {
          DEFAULT: "var(--color-background-card)",
          foreground: "var(--color-text-primary)",
        },
      },
      borderRadius: {
        lg: "var(--radius-container)",
        md: "var(--radius-element)",
        sm: "var(--radius-inner)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
