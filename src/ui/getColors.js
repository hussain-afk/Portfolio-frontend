// Single source of truth for portfolio colors.
// Use getColors(isDark) in any component (Header, Hero, About, Projects...).

export const getColors = (isDark) => ({
  bg: isDark ? "#0b1018" : "#f8fafc",
  surface: isDark ? "rgba(15, 22, 34, 0.85)" : "rgba(255, 255, 255, 0.9)",
  card: isDark ? "#111827" : "#ffffff",
  text: isDark ? "#f1f5f9" : "#0f172a",
  muted: isDark ? "#94a3b8" : "#526071",
  border: isDark ? "rgba(148, 163, 184, 0.16)" : "rgba(15, 23, 42, 0.10)",
  hover: isDark ? "rgba(148, 163, 184, 0.10)" : "rgba(15, 23, 42, 0.05)",
  accent: isDark ? "#60a5fa" : "#2563eb", // links, active states
  accentSolid: "#2563eb", // filled buttons (white text on top)
  accentSolidHover: "#1d4ed8",
  success: "#22c55e",

  // code card syntax colors
  code: {
    keyword: isDark ? "#c4b5fd" : "#7c3aed",
    key: isDark ? "#7dd3fc" : "#0369a1",
    string: isDark ? "#86efac" : "#15803d",
    bool: isDark ? "#fdba74" : "#c2410c",
    punc: isDark ? "#64748b" : "#64748b",
    plain: isDark ? "#e2e8f0" : "#0f172a",
  },
});