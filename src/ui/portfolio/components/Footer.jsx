import { Box, Container, Typography, Button } from "@mui/material";
import {
  ArrowUpwardRounded,
  GitHub,
  LinkedIn,
  MailOutlineRounded,
} from "@mui/icons-material";
import { getColors } from "../../getColors";

// ======================================================================
// EDIT ONLY THIS OBJECT to customize the Footer.
// Each item in `columns` becomes one link column. Add, remove or reorder
// columns and links freely. Links starting with "http" open in a new tab.
// ======================================================================
const footerData = {
  brand: {
    name: "Hussain",
    suffix: ".dev",
    initial: "H",
    tagline:
      "Frontend developer building fast, accessible and well-crafted interfaces for the web.",
    status: "Available for new projects",
  },

  columns: [
    {
      title: "Navigate",
      links: [
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Projects", href: "#projects" },
        { label: "Skills", href: "#skills" },
        { label: "Certificates", href: "#certifications" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "GitHub", href: "https://github.com/your-username", icon: <GitHub /> },
        { label: "LinkedIn", href: "https://linkedin.com/in/your-username", icon: <LinkedIn /> },
        { label: "you@example.com", href: "mailto:you@example.com", icon: <MailOutlineRounded /> },
      ],
    },
  ],

  copyright: "Hussain. All rights reserved.",
  credit: "Built with React and Material UI",
  backToTopLabel: "Back to top",
};
// ======================================================================

export default function Footer({ isDark = true, data = footerData }) {
  const colors = getColors(isDark);

  const focusRing = {
    "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 3 },
  };

  const linkSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    color: colors.muted,
    fontSize: 15,
    textDecoration: "none",
    borderRadius: "4px",
    transition: "color 150ms ease",
    "&:hover": { color: colors.text },
    "& svg": { fontSize: 18 },
    ...focusRing,
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 4, md: 8 },
        borderTop: `1px solid ${colors.border}`,
        background: colors.card,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        {/* Top: brand + link columns */}
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: `1.6fr repeat(${data.columns.length}, 1fr)`,
            },
            gap: { xs: 5, md: 6 },
          }}
        >
          {/* Brand */}
          <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1", md: "auto" }, maxWidth: 380 }}>
            <Box
              component="a"
              href="#home"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                textDecoration: "none",
                color: colors.text,
                borderRadius: "10px",
                ...focusRing,
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "11px",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 700,
                  background: colors.accentSolid,
                }}
              >
                {data.brand.initial}
              </Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>
                {data.brand.name}
                <Box component="span" sx={{ color: colors.accent }}>
                  {data.brand.suffix}
                </Box>
              </Typography>
            </Box>

            <Typography sx={{ mt: 2, color: colors.muted, fontSize: 15, lineHeight: 1.7 }}>
              {data.brand.tagline}
            </Typography>

            {data.brand.status && (
              <Box
                sx={{
                  mt: 2.5,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: "999px",
                  border: `1px solid ${colors.border}`,
                  color: colors.muted,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <Box
                  aria-hidden
                  sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.success }}
                />
                {data.brand.status}
              </Box>
            )}
          </Box>

          {/* Link columns */}
          {data.columns.map((column) => (
            <Box component="nav" key={column.title} aria-label={column.title}>
              <Typography
                component="h2"
                sx={{ mb: 2, color: colors.text, fontSize: 15, fontWeight: 700 }}
              >
                {column.title}
              </Typography>
              <Box
                component="ul"
                sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.5 }}
              >
                {column.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <Box component="li" key={link.label}>
                      <Box
                        component="a"
                        href={link.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        sx={linkSx}
                      >
                        {link.icon}
                        {link.label}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            py: 3,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <Box sx={{ color: colors.muted, fontSize: 14 }}>
            <Typography sx={{ fontSize: "inherit", color: "inherit" }}>
              &copy; {new Date().getFullYear()} {data.copyright}
            </Typography>
            {data.credit && (
              <Typography sx={{ mt: 0.25, fontSize: 13, color: "inherit", opacity: 0.85 }}>
                {data.credit}
              </Typography>
            )}
          </Box>

          <Button
            component="a"
            href="#home"
            startIcon={<ArrowUpwardRounded sx={{ fontSize: 18 }} />}
            sx={{
              px: 2,
              py: 0.9,
              borderRadius: "10px",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              color: colors.text,
              border: `1px solid ${colors.border}`,
              "&:hover": { background: colors.hover },
              ...focusRing,
            }}
          >
            {data.backToTopLabel}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}