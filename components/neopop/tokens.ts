/*
 * Taskify's NeoPOP compatibility tokens are adapted from CRED's
 * @cred/neopop-web project (Apache-2.0), pinned at commit 1f4b3d2.
 * The naming and semantic layer below are Taskify-specific modifications.
 */

export const neoPopPalette = {
  black: { 100: "#8A8A8A", 200: "#3D3D3D", 300: "#161616", 400: "#121212", 500: "#0D0D0D" },
  white: { 100: "#D2D2D2", 200: "#E0E0E0", 300: "#EFEFEF", 400: "#FBFBFB", 500: "#FFFFFF" },
  purple: { 100: "#E8DFFF", 200: "#D2C2FF", 300: "#B49AFF", 400: "#9772FF", 500: "#6A35FF", 600: "#4A25B3", 700: "#351A80", 800: "#20104D" },
  orange: { 100: "#FFEFE6", 200: "#FFDBC7", 300: "#FFC3A2", 400: "#FFAB7C", 500: "#FF8744", 600: "#B35F30", 700: "#804322", 800: "#4D2914" },
  pink: { 100: "#FFE1E9", 200: "#FFC6D4", 300: "#FFA0B7", 400: "#FF7B9A", 500: "#FF426F", 600: "#B32E4E", 700: "#802138", 800: "#4D1421" },
  yellow: { 100: "#FFF8E5", 200: "#FFEFC7", 300: "#FFE5A2", 400: "#FFDB7D", 500: "#FFCB45", 600: "#B38E30", 700: "#806623", 800: "#4D3D15" },
  lime: { 100: "#FBFFE6", 200: "#F7FFC6", 300: "#F2FF9F", 400: "#EDFE79", 500: "#E5FE40", 600: "#A0B22D", 700: "#727F20", 800: "#454C13" },
  green: { 100: "#DDFFF1", 200: "#C4FFE6", 300: "#9DFFD6", 400: "#76FFC6", 500: "#3BFFAD", 600: "#29B379", 700: "#1E8057", 800: "#124D34" },
  blue: { 100: "#C2D0F2", 200: "#89A5E3", 300: "#3F6FD9", 400: "#2C5ECD", 500: "#144CC7" },
  red: { 100: "#FCE2DD", 200: "#F6A69B", 300: "#F47564", 400: "#F05E4B", 500: "#EE4D37" },
} as const;
export const taskifyNeoPop = {
  background: neoPopPalette.black[500],
  surface: neoPopPalette.black[400],
  raised: neoPopPalette.black[300],
  text: neoPopPalette.white[500],
  textMuted: neoPopPalette.white[100],
  affirmative: neoPopPalette.yellow[500],
  progress: neoPopPalette.green[500],
  focus: neoPopPalette.blue[300],
  celebration: neoPopPalette.pink[500],
  edgeWidth: 3,
  edgeAngle: 45,
  pressDurationMs: 120,
} as const;
