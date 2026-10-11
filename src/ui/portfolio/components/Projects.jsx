import React, { useMemo, useState, useContext } from "react";

import { Box, Container, Typography, Button, Chip } from "@mui/material";

import {
  GitHub,
  OpenInNewRounded,
  CodeRounded,
} from "@mui/icons-material";

import { getColors } from "../../getColors";
import { Context } from "../../../context/Context.jsx";

// Original section settings
const projectsData = {
  title: "Projects",
  subtitle: "A selection of things I've designed and built.",
  allLabel: "All",
  maxTechChips: 4,
  liveLabel: "Live demo",
  sourceLabel: "Source code",
  projects: [],
};

// Normalize backend data without changing the card UI
function normalizeProject(project) {
  const rawTech =
    project.tech ??
    project.technologies ??
    project.skills ??
    [];

  return {
    ...project,
    title: project.title || project.name || "Untitled Project",
    category: project.category || "Other",
    description: project.description || "",
    image:
      project.image ||
      project.imageUrl ||
      project.thumbnail ||
      project.coverImage ||
      "",
    tech: Array.isArray(rawTech)
      ? rawTech
      : typeof rawTech === "string"
      ? rawTech.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
    liveUrl:
      project.liveUrl ||
      project.demoUrl ||
      project.live ||
      "",
    githubUrl:
      project.githubUrl ||
      project.github ||
      project.repositoryUrl ||
      "",
  };
}

// Original ProjectCard UI — preserved
function ProjectCard({ project, data, colors }) {
  const [imageFailed, setImageFailed] = useState(false);

  const hasImage = Boolean(project.image) && !imageFailed;

  const tech = project.tech || [];
  const shownTech = tech.slice(0, data.maxTechChips);
  const hiddenCount = tech.length - shownTech.length;

  const chipSx = {
    height: 22,
    color: "#fff",
    background: "rgba(255,255,255,0.16)",
    fontSize: 11.5,
    fontWeight: 500,
    borderRadius: "7px",
  };

  const overlayButtonSx = {
    px: 1.5,
    py: 0.65,
    minWidth: 0,
    borderRadius: "10px",
    fontSize: 13,
    fontWeight: 600,
    textTransform: "none",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(255,255,255,0.08)",
    "&:hover": {
      background: "rgba(255,255,255,0.2)",
    },
    "&:focus-visible": {
      outline: "2px solid #fff",
      outlineOffset: 2,
    },
  };

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        aspectRatio: { xs: "1 / 1", sm: "5 / 4" },
        borderRadius: "18px",
        background:
          "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: `1px solid ${colors.border}`,

        "&:hover .project-image": {
          transform: "scale(1.04)",
        },

        "&:hover .project-overlay, &:focus-within .project-overlay": {
          opacity: 0.9,
        },

        "@media (prefers-reduced-motion: reduce)": {
          "&:hover .project-image": {
            transform: "none",
          },
        },
      }}
    >
      {/* Layer 1: Project image */}
      {hasImage ? (
        <Box
          className="project-image"
          component="img"
          src={project.image}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: -2,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 400ms ease",
          }}
        />
      ) : (
        <CodeRounded
          aria-hidden
          sx={{
            position: "absolute",
            top: -16,
            right: -16,
            zIndex: -2,
            fontSize: 190,
            color: "rgba(255,255,255,0.07)",
          }}
        />
      )}

      {/* Layer 2: Original dark overlay */}
      <Box
        className="project-overlay"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.52) 100%)",
          transition: "opacity 250ms ease",
        }}
      />

      {/* Layer 3: Original card content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2,
          p: { xs: 2, sm: 2.5 },
          color: "#fff",
        }}
      >
        {/* Category */}
        <Box>
          <Box
            component="span"
            sx={{
              display: "inline-block",
              px: 1.25,
              py: 0.4,
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            {project.category}
          </Box>
        </Box>

        {/* Title, description, technologies and buttons */}
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

          <Typography
            title={project.description}
            sx={{
              mt: 0.75,
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.85)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description}
          </Typography>

          {shownTech.length > 0 && (
            <Box
              sx={{
                mt: 1.5,
                display: "flex",
                flexWrap: "wrap",
                gap: 0.6,
              }}
            >
              {shownTech.map((technology, index) => (
                <Chip
                  key={`${technology}-${index}`}
                  label={technology}
                  size="small"
                  sx={chipSx}
                />
              ))}

              {hiddenCount > 0 && (
                <Chip
                  label={`+${hiddenCount}`}
                  size="small"
                  sx={chipSx}
                />
              )}
            </Box>
          )}

          {(project.liveUrl || project.githubUrl) && (
            <Box
              sx={{
                mt: 1.75,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {project.liveUrl && (
                <Button
                  component="a"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewRounded sx={{ fontSize: 15 }} />}
                  aria-label={`${project.title}: ${data.liveLabel}`}
                  sx={overlayButtonSx}
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
                  sx={overlayButtonSx}
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

  const [activeCategory, setActiveCategory] = useState(
    sectionData.allLabel
  );

  // If categories change, keep the selected filter valid
  const categories = useMemo(
    () => [
      sectionData.allLabel,
      ...new Set(
        sectionData.projects
          .map((project) => project.category)
          .filter(Boolean)
      ),
    ],
    [sectionData.projects, sectionData.allLabel]
  );

  const visibleProjects =
    activeCategory === sectionData.allLabel
      ? sectionData.projects
      : sectionData.projects.filter(
          (project) => project.category === activeCategory
        );

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
        {/* Original heading */}
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

        {/* Original category filters */}
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
            const selected = category === activeCategory;

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
                  background: selected
                    ? colors.accentSolid
                    : "transparent",
                  border: `1px solid ${
                    selected ? colors.accentSolid : colors.border
                  }`,
                  "&:hover": {
                    background: selected
                      ? colors.accentSolidHover
                      : colors.hover,
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

        {/* Original card grid */}
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