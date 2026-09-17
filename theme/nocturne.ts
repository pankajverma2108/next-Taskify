import { defineTheme } from "@astryxdesign/core/theme";

export const nocturne = defineTheme({
  name: "taskify-nocturne",
  color: { accent: "#80C7FF", neutralStyle: "cool", contrast: "standard" },
  typography: {
    scale: { base: 14, ratio: 1.22 },
    body: { family: "var(--font-body)", fallbacks: "sans-serif" },
    heading: { family: "var(--font-display)", fallbacks: "sans-serif", weight: "semibold" },
    code: { family: "monospace", fallbacks: "monospace" },
  },
  radius: { base: 4, multiplier: 1.3 },
  motion: { fast: 120, medium: 220, slow: 420, ratio: 0.75 },
  tokens: {
    "--color-background-body": "#0B0E14",
    "--color-background-surface": "#10151E",
    "--color-background-card": "#171E29",
    "--color-background-popover": "#1B2431",
    "--color-background-muted": "#1C2634",
    "--color-text-primary": "#EDF3FC",
    "--color-text-secondary": "#A5B3C7",
    "--color-border": "#2A3546",
    "--color-border-emphasized": "#72839C",
    "--focus-outline-color": "#94D6FF",
  },
  components: {
    "side-nav": { base: { backgroundColor: "var(--color-background-body)" } },
    "heading": { base: { letterSpacing: "-0.035em" } },
  },
  adaptations: {
    rules: [{
      when: { motion: "reduce" },
      value: { tokens: { "--duration-fast": "0ms", "--duration-medium": "0ms", "--duration-slow": "0ms" } },
    }],
  },
});
