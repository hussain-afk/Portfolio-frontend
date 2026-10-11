import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { CodeRounded } from "@mui/icons-material";
import { getColors } from "../../getColors";
import { skillIcons } from "./SkillIcons";

// ======================================================================
// EDIT ONLY THIS OBJECT to customize the Skills section.
// Each skill is one tile:
//   name  - label shown under the logo
//   icon  - logo key from skillIcons.jsx (e.g. "react", "nodejs", "docker")
//   color - brand color of the logo (hex). Use "text" for logos that are
//           black or white, so they follow the dark/light theme.
//   logo  - optional image URL (e.g. "/logos/mytool.svg") that replaces the icon
// Add, remove or reorder skills freely; the grid updates automatically.
// ======================================================================
const skillsData = {
  title: "Skills & Technologies",
  subtitle: "",
  skills: [
    { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
    { name: "TypeScript", icon: "typescript", color: "#3178C6" },
    { name: "React", icon: "react", color: "#61DAFB" },
    { name: "Node.js", icon: "nodejs", color: "#5FA04E" },
    { name: "MongoDB", icon: "mongodb", color: "#47A248" },
    { name: "Express.js", icon: "express", color: "text" },
    { name: "Next.js", icon: "nextjs", color: "text" },
    { name: "Redux", icon: "redux", color: "#764ABC" },
    { name: "HTML5", icon: "html5", color: "#E34F26" },
    { name: "CSS3", icon: "css3", color: "#1572B6" },
    { name: "Tailwind CSS", icon: "tailwind", color: "#06B6D4" },
    { name: "Material UI", icon: "mui", color: "#007FFF" },
    { name: "Firebase", icon: "firebase", color: "#FFCA28" },
    { name: "Git", icon: "git", color: "#F05032" },
    { name: "GitHub", icon: "github", color: "text" },
    { name: "REST API", icon: "restapi", color: "#6366F1" },
    { name: "Docker", icon: "docker", color: "#2496ED" },
    { name: "PostgreSQL", icon: "postgresql", color: "#4169E1" },
  ],
};
// ======================================================================

export default function Skills({ isDark = true, data = skillsData }) {
  const colors = getColors(isDark);

  // Returns the logo for a skill: custom image, icon key, or a ready-made element
  const renderLogo = (skill) => {
    if (skill.logo) {
      return (
        <Box
          component="img"
          src={skill.logo}
          alt=""
          loading="lazy"
          sx={{ width: 34, height: 34, objectFit: "contain" }}
        />
      );
    }
    if (React.isValidElement(skill.icon)) return skill.icon;
    const Icon = skillIcons[skill.icon] || CodeRounded;
    return <Icon />;
  };

  return (
    <Box
      component="section"
      id="skills"
      sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        {/* Centered heading with accent underline */}
        <Box sx={{ textAlign: "center" }}>
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
          <Box
            aria-hidden
            sx={{
              width: 48,
              height: 4,
              mx: "auto",
              mt: 2,
              borderRadius: "999px",
              background: colors.accent,
            }}
          />
          {data.subtitle && (
            <Typography
              sx={{
                mt: 2,
                color: colors.muted,
                fontSize: { xs: 16, md: 17 },
              }}
            >
              {data.subtitle}
            </Typography>
          )}
        </Box>

        {/* Skill tiles */}
        <Box
          component="ul"
          sx={{
            m: 0,
            mt: { xs: 5, md: 7 },
            p: 0,
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(3, 1fr)",
              sm: "repeat(auto-fill, minmax(120px, 1fr))",
            },
            gap: { xs: 1.25, sm: 2 },
          }}
        >
          {data.skills.map((skill) => {
            const logoColor =
              !skill.color || skill.color === "text" ? colors.text : skill.color;

            return (
              <Box
                component="li"
                key={skill.name}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  minHeight: { xs: 92, sm: 100 },
                  px: 1,
                  py: 2,
                  textAlign: "center",
                  borderRadius: "14px",
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  transition: "border-color 150ms ease, transform 150ms ease",
                  "&:hover": {
                    borderColor: colors.accent,
                    transform: "translateY(-2px)",
                  },
                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",
                    "&:hover": { transform: "none" },
                  },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    height: 34,
                    color: logoColor,
                    "& svg": { width: 34, height: 34 },
                  }}
                >
                  {renderLogo(skill)}
                </Box>
                <Typography
                  sx={{
                    color: colors.text,
                    fontSize: { xs: 12.5, sm: 14 },
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {skill.name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}