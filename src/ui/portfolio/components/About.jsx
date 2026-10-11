import { Box, Container, Typography } from "@mui/material";
import {
  PlaceOutlined,
  WorkOutlineRounded,
  SchoolOutlined,
  TranslateRounded,
  MailOutlineRounded,
  SpeedRounded,
  AccessibilityNewRounded,
  DevicesRounded,
} from "@mui/icons-material";
import { getColors } from "../../getColors";

// ======================================================================
// EDIT ONLY THIS OBJECT to customize the About section.
// Add, remove or reorder items in any array; the UI updates automatically.
// ======================================================================
const aboutData = {
  title: "About me",
  subtitle: "A little about who I am and how I work.",

  // Each string becomes one paragraph
  paragraphs: [
    "I'm Muhammad Hussain Memon, a Front-End & MERN Stack Developer based in Karachi, passionate about transforming ideas into sleek, high-performance web applications. I specialize in building scalable digital experiences where visual design meets clean, efficient code.",
    "My daily workflow revolves around React.js, Next.js, Node.js, and Material UI. I focus on crafting glassmorphic, cyber-dark UI components that are intuitive for users, fully responsive, and effortless to maintain.",
    "Beyond writing code, I constantly explore motion design with Framer Motion, dive into backend architecture, and experiment with full-stack SaaS projects like field verification platforms and localized marketplaces."
  ],

  // Quick facts card (icon is optional)
  facts: [
    { label: "Location", value: "Karachi, Pakistan", icon: <PlaceOutlined /> },
    { label: "Role", value: "FullStack Developer", icon: <WorkOutlineRounded /> },
    { label: "Education", value: "DAE in Software Technology", icon: <SchoolOutlined /> },
    { label: "Languages", value: "Urdu", icon: <TranslateRounded /> },
    { label: "Email", value: "hussainkadir245@gmail.com", icon: <MailOutlineRounded />, href: "mailto:you@example.com" },
  ],

  // What you focus on
  focusTitle: "What I focus on",
  focus: [
    {
      title: "Responsive layouts",
      description: "Interfaces that feel right on phones, tablets and large screens.",
      icon: <DevicesRounded />,
    },
    {
      title: "Performance",
      description: "Small bundles, fast first load and smooth interactions.",
      icon: <SpeedRounded />,
    },
    {
      title: "Accessibility",
      description: "Keyboard support, good contrast and meaningful labels.",
      icon: <AccessibilityNewRounded />,
    },
  ],

  // Experience / education journey, newest first
  timelineTitle: "My journey",
  timeline: [
    {
      period: "2026 - Present",
      title: "DAE In Software Technology",
      place: "Jinnah Polytechnic Institute",
      description: "Studying software development, web technologies and programming languages.",
    },
    {
      period: "2025 - 2026",
      title: "Modern Web Application Development",
      place: "Zaitoon Ashraf IT Park By Saylani (SMIT)",
      description: "Studied FullStack web development, data structures and software engineering.",
    },
  ],
};
// ======================================================================

export default function About({ isDark = true, data = aboutData }) {
  const colors = getColors(isDark);

  const focusRing = {
    "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
  };

  const subHeading = {
    color: colors.text,
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "-0.3px",
    mb: 3,
  };

  return (
    <Box
      component="section"
      id="about"
      sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        {/* Section heading */}
        <Typography
          component="h2"
          sx={{
            color: colors.text,
            fontSize: { xs: 30, md: 40 },
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.15,
          }}
        >
          {data.title}
        </Typography>
        <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: { xs: 16, md: 17 } }}>
          {data.subtitle}
        </Typography>

        {/* Bio + quick facts */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
            gap: { xs: 5, md: 8 },
            alignItems: "start",
          }}
        >
          <Box sx={{ display: "grid", gap: 2.5, maxWidth: 620 }}>
            {data.paragraphs.map((text, i) => (
              <Typography
                key={i}
                sx={{ color: colors.muted, fontSize: { xs: 16, md: 17 }, lineHeight: 1.8 }}
              >
                {text}
              </Typography>
            ))}
          </Box>

          <Box
            component="dl"
            sx={{
              m: 0,
              p: { xs: 2, sm: 3 },
              borderRadius: "18px",
              background: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            {data.facts.map((fact, i) => (
              <Box
                key={fact.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.75,
                  py: 1.75,
                  borderTop: i === 0 ? "none" : `1px solid ${colors.border}`,
                  "&:first-of-type": { pt: 0 },
                  "&:last-of-type": { pb: 0 },
                }}
              >
                {fact.icon && (
                  <Box
                    aria-hidden
                    sx={{
                      display: "grid",
                      placeItems: "center",
                      width: 38,
                      height: 38,
                      flexShrink: 0,
                      borderRadius: "10px",
                      color: colors.accent,
                      background: colors.hover,
                      "& svg": { fontSize: 20 },
                    }}
                  >
                    {fact.icon}
                  </Box>
                )}
                <Box sx={{ minWidth: 0 }}>
                  <Typography component="dt" sx={{ color: colors.muted, fontSize: 13 }}>
                    {fact.label}
                  </Typography>
                  <Typography
                    component="dd"
                    sx={{ m: 0, color: colors.text, fontSize: 15, fontWeight: 600, wordBreak: "break-word" }}
                  >
                    {fact.href ? (
                      <Box
                        component="a"
                        href={fact.href}
                        sx={{
                          color: "inherit",
                          textDecoration: "none",
                          borderRadius: "4px",
                          "&:hover": { color: colors.accent },
                          ...focusRing,
                        }}
                      >
                        {fact.value}
                      </Box>
                    ) : (
                      fact.value
                    )}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Focus + timeline */}
        <Box
          sx={{
            mt: { xs: 8, md: 10 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 7, md: 8 },
          }}
        >
          {/* Focus */}
          <Box>
            <Typography component="h3" sx={subHeading}>
              {data.focusTitle}
            </Typography>
            <Box sx={{ display: "grid", gap: 3 }}>
              {data.focus.map((item) => (
                <Box key={item.title} sx={{ display: "flex", gap: 2 }}>
                  <Box
                    aria-hidden
                    sx={{
                      display: "grid",
                      placeItems: "center",
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      borderRadius: "12px",
                      color: colors.accent,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ color: colors.text, fontSize: 16, fontWeight: 650 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: colors.muted, fontSize: 15, lineHeight: 1.7 }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Timeline */}
          <Box>
            <Typography component="h3" sx={subHeading}>
              {data.timelineTitle}
            </Typography>
            <Box
              component="ol"
              sx={{
                m: 0,
                p: 0,
                ml: 0.75,
                listStyle: "none",
                borderLeft: `1px solid ${colors.border}`,
              }}
            >
              {data.timeline.map((item) => (
                <Box
                  component="li"
                  key={`${item.period}-${item.title}`}
                  sx={{
                    position: "relative",
                    pl: 3.5,
                    pb: 3.5,
                    "&:last-of-type": { pb: 0 },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: -5,
                      top: 7,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: colors.accent,
                      boxShadow: `0 0 0 4px ${colors.bg}`,
                    },
                  }}
                >
                  <Typography sx={{ color: colors.muted, fontSize: 13 }}>
                    {item.period}
                  </Typography>
                  <Typography sx={{ mt: 0.25, color: colors.text, fontSize: 16, fontWeight: 650 }}>
                    {item.title}
                  </Typography>
                  {item.place && (
                    <Typography sx={{ color: colors.accent, fontSize: 14, fontWeight: 500 }}>
                      {item.place}
                    </Typography>
                  )}
                  {item.description && (
                    <Typography sx={{ mt: 0.75, color: colors.muted, fontSize: 15, lineHeight: 1.7 }}>
                      {item.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
import React from "react";