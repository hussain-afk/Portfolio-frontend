import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Collapse,
  ClickAwayListener,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import avatar from '../../../assets/myProfile.png'
import { useTheme } from "@mui/material/styles";
import {
  LightModeRounded,
  DarkModeRounded,
  ArrowOutwardRounded,
  MenuRounded,
  CloseRounded,
} from "@mui/icons-material";
import { getColors } from "../../getColors";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Certificates", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export default function Header({ isDark = true, onThemeToggle }) {
  const muiTheme = useTheme();
  const mobile = useMediaQuery(muiTheme.breakpoints.down("lg"));
  const colors = getColors(isDark);

  const [active, setActive] = useState("#home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navigateTo = (href) => {
    setActive(href);
    closeMenu();
  };

  // Slightly compact navbar after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const sections = navLinks
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu when the screen becomes big (desktop navigation takes over)
  useEffect(() => {
    if (!mobile) setMenuOpen(false);
  }, [mobile]);

  // Press Escape to close the mobile menu
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const primaryButtonSx = {
    px: 2.25,
    py: 1,
    borderRadius: "10px",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    textTransform: "none",
    whiteSpace: "nowrap",
    background: colors.accentSolid,
    boxShadow: "none",
    "&:hover": { background: colors.accentSolidHover, boxShadow: "none" },
    "&:focus-visible": {
      outline: `2px solid ${colors.accent}`,
      outlineOffset: 2,
    },
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1200,
        pt: { xs: 1, md: scrolled ? 1 : 2 },
        pb: 1,
        px: { xs: 1.5, sm: 2, md: 3 },
        transition: "padding 200ms ease",
        pointerEvents: "none",
      }}
    >
      <Container maxWidth="lg" disableGutters>
        {/* Click outside this box (navbar + menu) to close the mobile menu */}
        <ClickAwayListener onClickAway={closeMenu}>
          <Box sx={{ position: "relative" }}>
            <AppBar
              position="static"
              elevation={0}
              sx={{
                pointerEvents: "auto",
                color: colors.text,
                background: colors.surface,
                backgroundImage: "none",
                border: `1px solid ${colors.border}`,
                borderRadius: "16px",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: scrolled
                  ? isDark
                    ? "0 8px 30px rgba(0,0,0,0.3)"
                    : "0 8px 30px rgba(15,23,42,0.08)"
                  : "none",
                transition: "box-shadow 200ms ease",
              }}
            >
              <Toolbar
                disableGutters
                sx={{
                  minHeight: { xs: 60, md: scrolled ? 62 : 68 },
                  px: { xs: 1.5, md: 2.5 },
                  justifyContent: "space-between",
                  gap: 2,
                  transition: "min-height 200ms ease",
                }}
              >
                {/* Brand */}
                <Box
                  component="a"
                  href="#home"
                  onClick={() => navigateTo("#home")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    textDecoration: "none",
                    color: colors.text,
                    borderRadius: "10px",
                    "&:focus-visible": {
                      outline: `2px solid ${colors.accent}`,
                      outlineOffset: 3,
                    },
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
                    <Avatar alt="MHM" src={avatar} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        letterSpacing: "-0.3px",
                      }}
                    >
                      MHM
                      <Box component="span" sx={{ color: colors.accent }}>
                        .dev
                      </Box>
                    </Typography>
                    <Typography
                      sx={{
                        display: { xs: "none", sm: "block" },
                        color: colors.muted,
                        fontSize: 12,
                        lineHeight: 1.2,
                      }}
                    >
                      Frontend developer
                    </Typography>
                  </Box>
                </Box>

                {/* Desktop navigation */}
                {!mobile && (
                  <Box
                    component="nav"
                    aria-label="Main navigation"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    {navLinks.map((item) => {
                      const selected = active === item.href;
                      return (
                        <Button
                          key={item.href}
                          component="a"
                          href={item.href}
                          onClick={() => navigateTo(item.href)}
                          aria-current={selected ? "location" : undefined}
                          sx={{
                            px: 1.75,
                            py: 0.9,
                            borderRadius: "10px",
                            fontSize: 14,
                            fontWeight: selected ? 600 : 500,
                            textTransform: "none",
                            color: selected ? colors.text : colors.muted,
                            background: selected ? colors.hover : "transparent",
                            transition: "color 150ms ease, background 150ms ease",
                            "&:hover": {
                              color: colors.text,
                              background: colors.hover,
                            },
                            "&:focus-visible": {
                              outline: `2px solid ${colors.accent}`,
                              outlineOffset: 2,
                            },
                          }}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </Box>
                )}

                {/* Actions */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {onThemeToggle && (
                    <IconButton
                      aria-label={
                        isDark ? "Switch to light theme" : "Switch to dark theme"
                      }
                      onClick={onThemeToggle}
                      sx={{
                        width: 38,
                        height: 38,
                        color: colors.muted,
                        border: `1px solid ${colors.border}`,
                        borderRadius: "10px",
                        "&:hover": { color: colors.text, background: colors.hover },
                      }}
                    >
                      {isDark ? (
                        <LightModeRounded fontSize="small" />
                      ) : (
                        <DarkModeRounded fontSize="small" />
                      )}
                    </IconButton>
                  )}

                  {!mobile && (
                    <Button
                      component="a"
                      href="#contact"
                      onClick={() => navigateTo("#contact")}
                      endIcon={<ArrowOutwardRounded sx={{ fontSize: 18 }} />}
                      sx={primaryButtonSx}
                    >
                      Let&apos;s talk
                    </Button>
                  )}

                  {mobile && (
                    <IconButton
                      aria-label={menuOpen ? "Close menu" : "Open menu"}
                      aria-expanded={menuOpen}
                      aria-controls="mobile-menu"
                      onClick={() => setMenuOpen((open) => !open)}
                      sx={{
                        width: 38,
                        height: 38,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        borderRadius: "10px",
                        "&:hover": { background: colors.hover },
                      }}
                    >
                      {menuOpen ? <CloseRounded /> : <MenuRounded />}
                    </IconButton>
                  )}
                </Box>
              </Toolbar>
            </AppBar>

            {/* Mobile menu: opens right under the navbar and takes the FULL width of it.
                It floats over the page (position: absolute), so the page does not jump. */}
            {mobile && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  mt: 1,
                  pointerEvents: menuOpen ? "auto" : "none",
                }}
              >
                <Collapse in={menuOpen} timeout={220} unmountOnExit>
                  <Box
                    id="mobile-menu"
                    component="nav"
                    aria-label="Mobile navigation"
                    sx={{
                      p: 1.25,
                      maxHeight: "calc(100vh - 110px)",
                      overflowY: "auto",
                      color: colors.text,
                      background: colors.card,
                      backgroundImage: "none",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "16px",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
                    }}
                  >
                    {/* One column on phones, two columns on bigger screens */}
                    <Box
                      sx={{
                        display: "grid",
                        gap: 0.5,
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      }}
                    >
                      {navLinks.map((item) => {
                        const selected = active === item.href;
                        return (
                          <Box
                            key={item.href}
                            component="a"
                            href={item.href}
                            onClick={() => navigateTo(item.href)}
                            aria-current={selected ? "location" : undefined}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 1.5,
                              px: 1.75,
                              borderRadius: "10px",
                              textDecoration: "none",
                              fontSize: 15,
                              fontWeight: selected ? 600 : 500,
                              color: selected ? colors.text : colors.muted,
                              background: selected ? colors.hover : "transparent",
                              transition: "color 150ms ease, background 150ms ease",
                              "&:hover": { color: colors.text, background: colors.hover },
                              "&:focus-visible": {
                                outline: `2px solid ${colors.accent}`,
                                outlineOffset: 2,
                              },
                            }}
                          >
                            {item.label}
                            {selected && (
                              <Box
                                aria-hidden
                                sx={{
                                  ml: "auto",
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  bgcolor: colors.accent,
                                }}
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Box>

                    <Box sx={{ pt: 1.25 }}>
                      <Button
                        fullWidth
                        component="a"
                        href="#contact"
                        onClick={() => navigateTo("#contact")}
                        endIcon={<ArrowOutwardRounded sx={{ fontSize: 18 }} />}
                        sx={{ ...primaryButtonSx, py: 1.3 }}
                      >
                        Let&apos;s talk
                      </Button>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </Container>
    </Box>
  );
}