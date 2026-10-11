import React, { useMemo, useState, useContext } from "react";

import { Box, Container, Typography, Button, Chip } from "@mui/material";

import { GitHub, OpenInNewRounded, CodeRounded } from "@mui/icons-material";

import { getColors } from "../../getColors";
import { Context } from "../../../context/Context.jsx";

// Section settings
const projectsData = {
  title: "Projects",
  subtitle: "A selection of things I've designed and built.",
  allLabel: "All",
  maxTechChips: 4,
  liveLabel: "Live demo",
  sourceLabel: "Source code",
  projects: [],
};

// Normalize backend data so the card always gets the fields it needs
function normalizeProject(project) {
  const rawTech = project.tech ?? project.technologies ?? project.skills ?? [];

  return {
    ...project,
    title: project.title || project.name || "Untitled Project",
    category: project.category || "Other",
    description: project.description || "",
    image: project.image || project.imageUrl || project.thumbnail || project.coverImage || "",
    tech: Array.isArray(rawTech)
      ? rawTech
      : typeof rawTech === "string"
      ? rawTech.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
    liveUrl: project.liveUrl || project.demoUrl || project.live || "",
    githubUrl: project.githubUrl || project.github || project.repositoryUrl || "",
  };
}

/* ------------------------------------------------------------------ */
/* Card styles (shared look, easy to tweak)                             */
/* ------------------------------------------------------------------ */

// Frosted-glass pill (category badge)
const glassSx = {
  background: "rgba(15, 23, 42, 0.55)",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

// Small chip with the technology name
const chipSx = {
  height: 24,
  color: "rgba(255,255,255,0.92)",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.12)",
  fontSize: 11.5,
  fontWeight: 500,
  borderRadius: "8px",
};

// Card buttons: the main one is solid white, the other one is an outline
const buttonSx = (primary) => ({
  px: 1.75,
  py: 0.7,
  minWidth: 0,
  borderRadius: "10px",
  fontSize: 13,
  fontWeight: 600,
  textTransform: "none",
  color: primary ? "#0f172a" : "#fff",
  background: primary ? "#fff" : "rgba(255,255,255,0.06)",
  border: `1px solid ${primary ? "#fff" : "rgba(255,255,255,0.3)"}`,
  "&:hover": { background: primary ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.16)" },
  "&:focus-visible": { outline: "2px solid #fff", outlineOffset: 2 },
});

// One project card: image background + dark layer + clean text
function ProjectCard({ project, data, colors }) {
  const [imageFailed, setImageFailed] = useState(false);

  const hasImage = Boolean(project.image) && !imageFailed;

  const tech = project.tech || [];
  const shownTech = tech.slice(0, data.maxTechChips);
  const hiddenCount = tech.length - shownTech.length;

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: { xs: 360, sm: 390 },
        borderRadius: "20px",
        // used when there is no image: dark gradient with a soft blue glow
        background:
          "radial-gradient(circle at 85% 0%, rgba(56,189,248,0.22) 0%, transparent 55%), linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: `1px solid ${colors.border}`,
        transition: "transform 300ms ease, box-shadow 300ms ease",
        // Hover: card lifts a little and the image zooms slowly
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 22px 44px rgba(0,0,0,0.35)" },
        "&:hover .project-image": { transform: "scale(1.05)" },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
          "&:hover .project-image": { transform: "none" },
        },
      }}
    >
      {/* Layer 1: project image (or a faint icon when there is no image) */}
      {hasImage ? (
        <Box
          className="project-image"
          component="img"
          src={project.image}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: -2,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 600ms ease",
          }}
        />
      ) : (
        <CodeRounded
          aria-hidden
          sx={{
            position: "absolute",
            top: "14%",
            right: "-4%",
            zIndex: -2,
            fontSize: 200,
            color: "rgba(255,255,255,0.06)",
          }}
        />
      )}

      {/* Layer 2: dark layer. Light at the top so the image shows, strong at the bottom for the text */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(2,6,23,0.96) 0%, rgba(2,6,23,0.8) 42%, rgba(2,6,23,0.2) 75%, rgba(2,6,23,0.4) 100%)",
        }}
      />

      {/* Layer 3: content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2.5,
          p: { xs: 2, sm: 2.5 },
          color: "#fff",
        }}
      >
        {/* Top: category badge */}
        <Box>
          <Box
            component="span"
            sx={{
              ...glassSx,
              display: "inline-block",
              px: 1.5,
              py: 0.5,
              borderRadius: "999px",
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: "0.2px",
            }}
          >
            {project.category}
          </Box>
        </Box>

        {/* Bottom: title, description, technologies, buttons */}
        <Box>
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: 20, sm: 22 },
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-0.3px",
            }}
          >
            {project.title}
          </Typography>

          {project.description && (
            <Typography
              title={project.description}
              sx={{
                mt: 0.75,
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.82)",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.description}
            </Typography>
          )}

          {shownTech.length > 0 && (
            <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 0.6 }}>
              {shownTech.map((technology, index) => (
                <Chip key={`${technology}-${index}`} label={technology} size="small" sx={chipSx} />
              ))}

              {hiddenCount > 0 && <Chip label={`+${hiddenCount}`} size="small" sx={chipSx} />}
            </Box>
          )}

          {(project.liveUrl || project.githubUrl) && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {project.liveUrl && (
                <Button
                  component="a"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewRounded sx={{ fontSize: 15 }} />}
                  aria-label={`${project.title}: ${data.liveLabel}`}
                  sx={buttonSx(true)}
                >
                  {data.liveLabel}
                </Button>
              )}

              {project.githubUrl && (
                <Button
                  component="a"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GitHub sx={{ fontSize: 17 }} />}
                  aria-label={`${project.title}: ${data.sourceLabel}`}
                  sx={buttonSx(!project.liveUrl)}
                >
                  {data.sourceLabel}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// Projects section connected to Context API
export default function Projects({ isDark = true, data = projectsData }) {
  const contextValue = useContext(Context);

  // Supports either { projects: [...] } or { projects: { projects: [...] } }
  const contextProjects = contextValue?.projects;

  const backendProjects = Array.isArray(contextProjects)
    ? contextProjects
    : Array.isArray(contextProjects?.projects)
    ? contextProjects.projects
    : [];

  const colors = getColors(isDark);

  const sectionData = useMemo(
    () => ({
      ...projectsData,
      ...data,
      projects: backendProjects.map(normalizeProject),
    }),
    [backendProjects, data]
  );

  const [activeCategory, setActiveCategory] = useState(sectionData.allLabel);

  const categories = useMemo(
    () => [
      sectionData.allLabel,
      ...new Set(sectionData.projects.map((project) => project.category).filter(Boolean)),
    ],
    [sectionData.projects, sectionData.allLabel]
  );

  // If the selected category no longer exists (for example a project was deleted), go back to "All"
  const selectedCategory = categories.includes(activeCategory)
    ? activeCategory
    : sectionData.allLabel;

  const visibleProjects =
    selectedCategory === sectionData.allLabel
      ? sectionData.projects
      : sectionData.projects.filter((project) => project.category === selectedCategory);

  const focusRing = {
    "&:focus-visible": {
      outline: `2px solid ${colors.accent}`,
      outlineOffset: 2,
    },
  };

  return (
    <Box
      component="section"
      id="projects"
      sx={{
        scrollMarginTop: 90,
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        {/* Heading */}
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
          {sectionData.title}
        </Typography>

        <Typography
          sx={{
            mt: 1.5,
            color: colors.muted,
            fontSize: { xs: 16, md: 17 },
          }}
        >
          {sectionData.subtitle}
        </Typography>

        {/* Category filters */}
        <Box
          role="group"
          aria-label="Filter projects by category"
          sx={{
            mt: 4,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {categories.map((category) => {
            const selected = category === selectedCategory;

            return (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={selected}
                sx={{
                  px: 2,
                  py: 0.7,
                  minWidth: 0,
                  borderRadius: "999px",
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  color: selected ? "#fff" : colors.muted,
                  background: selected ? colors.accentSolid : "transparent",
                  border: `1px solid ${selected ? colors.accentSolid : colors.border}`,
                  "&:hover": {
                    background: selected ? colors.accentSolidHover : colors.hover,
                    color: selected ? "#fff" : colors.text,
                  },
                  ...focusRing,
                }}
              >
                {category}
              </Button>
            );
          })}
        </Box>

        {/* Card grid */}
        <Box
          sx={{
            mt: 4,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project._id || project.id || `${project.title}-${index}`}
              project={project}
              data={sectionData}
              colors={colors}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}