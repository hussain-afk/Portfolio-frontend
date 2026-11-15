import { useMemo, useState, useContext } from "react";

import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Skeleton,
} from "@mui/material";

import { GitHub, OpenInNewRounded, CodeRounded } from "@mui/icons-material";

import { getColors } from "../../getColors";
import { Context } from "../../../context/Context.jsx";
import Carousel from "./Carousel";

// Section settings
const projectsData = {
  eyebrow: "Portfolio",
  title: "Projects",
  subtitle: "A selection of things I've designed and built.",
  allLabel: "All",
  maxTechChips: 4,
  liveLabel: "Live demo",
  sourceLabel: "Source code",
  emptyLabel: "No projects to show yet.",
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
/* Theme helpers                                                        */
/* ------------------------------------------------------------------ */

// Halka tint: dark par safed, light par gehra, taake dono themes mein nazar aaye
const tint = (isDark, strength = 1) =>
  isDark
    ? `rgba(255,255,255,${0.05 * strength})`
    : `rgba(15,23,42,${0.045 * strength})`;

// Hover par border thoda accent ki taraf jhukta hai
const accentBorder = (colors) =>
  `color-mix(in srgb, ${colors.accent} 45%, ${colors.border})`;

const focusOutline = (colors) => ({
  "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
});

// Primary = solid accent button, secondary = outline
const buttonSx = (primary, colors) => ({
  px: 1.75,
  py: 0.7,
  minWidth: 0,
  borderRadius: "10px",
  fontSize: 13,
  fontWeight: 600,
  textTransform: "none",
  color: primary ? "#fff" : colors.text,
  background: primary ? colors.accentSolid : "transparent",
  border: `1px solid ${primary ? colors.accentSolid : colors.border}`,
  "&:hover": { background: primary ? colors.accentSolidHover : colors.hover },
  ...focusOutline(colors),
});

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */

function ProjectCard({ project, index, data, colors, isDark }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasImage = Boolean(project.image) && !imageFailed;

  const shownTech = project.tech.slice(0, data.maxTechChips);
  const hiddenCount = project.tech.length - shownTech.length;

  const surface =
    colors.card || colors.surface || (isDark ? "rgba(255,255,255,0.03)" : "#ffffff");

  const chipSx = {
    height: 24,
    color: colors.muted,
    background: tint(isDark),
    border: `1px solid ${colors.border}`,
    fontSize: 12,
    fontWeight: 500,
    borderRadius: "7px",
  };

  const glass = {
    color: "#fff",
    background: "rgba(15,23,42,0.6)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderRadius: "999px",
    fontSize: 12,
    fontWeight: 600,
  };

  return (
    <Box
      component="article"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        borderRadius: "18px",
        background: surface,
        border: `1px solid ${colors.border}`,
        transition: "transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: accentBorder(colors),
          boxShadow: isDark
            ? "0 20px 44px rgba(0,0,0,0.42)"
            : "0 16px 36px rgba(15,23,42,0.13)",
        },
        "&:hover .project-image": { transform: "scale(1.05)" },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
          "&:hover .project-image": { transform: "none" },
        },
      }}
    >
      {/* Image area */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          flexShrink: 0,
          background: tint(isDark, 1.2),
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {hasImage ? (
          <>
            {!imageLoaded && (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              />
            )}
            <Box
              className="project-image"
              component="img"
              src={project.image}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: imageLoaded ? 1 : 0,
                transition: "transform 500ms ease, opacity 400ms ease",
              }}
            />
          </>
        ) : (
          <Box
            aria-hidden
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.muted,
              opacity: 0.45,
            }}
          >
            <CodeRounded sx={{ fontSize: 56 }} />
          </Box>
        )}

        {/* Upar halka gradient, taake pills har image par padhi jayen */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, rgba(2,6,23,0.38) 0%, rgba(2,6,23,0) 42%)",
          }}
        />

        <Box component="span" sx={{ ...glass, position: "absolute", top: 12, left: 12, px: 1.25, py: 0.4 }}>
          {project.category}
        </Box>

        <Box
          component="span"
          aria-hidden
          sx={{
            ...glass,
            position: "absolute",
            top: 12,
            right: 12,
            px: 1,
            py: 0.4,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: { xs: 2, sm: 2.5 } }}>
        <Typography
          component="h3"
          sx={{
            color: colors.text,
            fontSize: 19,
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "-0.2px",
          }}
        >
          {project.title}
        </Typography>

        {project.description && (
          <Typography
            title={project.description}
            sx={{
              mt: 0.75,
              color: colors.muted,
              fontSize: 14,
              lineHeight: 1.65,
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
          <Box sx={{ mt: 1.75, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {shownTech.map((technology, i) => (
              <Chip key={`${technology}-${i}`} label={technology} size="small" sx={chipSx} />
            ))}
            {hiddenCount > 0 && <Chip label={`+${hiddenCount}`} size="small" sx={chipSx} />}
          </Box>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <Box
            sx={{
              mt: "auto",
              pt: 2.25,
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
                sx={buttonSx(true, colors)}
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
                sx={buttonSx(!project.liveUrl, colors)}
              >
                {data.sourceLabel}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Loading skeleton                                                     */
/* ------------------------------------------------------------------ */

function ProjectSkeletons({ colors, isDark }) {
  return (
    <Box
      role="status"
      aria-label="Loading projects"
      sx={{
        mt: 4,
        display: "grid",
        gap: 2.5,
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
      }}
    >
      {[0, 1, 2].map((key) => (
        <Box
          key={key}
          sx={{
            display: { xs: key === 0 ? "block" : "none", sm: key < 2 ? "block" : "none", md: "block" },
            overflow: "hidden",
            borderRadius: "18px",
            border: `1px solid ${colors.border}`,
            background: tint(isDark, 0.6),
          }}
        >
          <Skeleton variant="rectangular" animation="wave" sx={{ aspectRatio: "16 / 9", width: "100%", height: "auto" }} />
          <Box sx={{ p: 2.5 }}>
            <Skeleton animation="wave" width="65%" height={28} />
            <Skeleton animation="wave" width="100%" />
            <Skeleton animation="wave" width="80%" />
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Skeleton animation="wave" variant="rounded" width={64} height={24} />
              <Skeleton animation="wave" variant="rounded" width={64} height={24} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function Message({ children, action }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: 8,
        textAlign: "center",
      }}
    >
      {children}
      {action}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

// Projects section connected to Context API
export default function Projects({ isDark = true, data = projectsData }) {
  const contextValue = useContext(Context);
  const { loading = false, errors = {}, refreshData } = contextValue || {};
  const error = errors.projects;

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

  // Har category mein kitne projects hain (filter buttons par dikhte hain)
  const counts = useMemo(() => {
    const result = { [sectionData.allLabel]: sectionData.projects.length };
    sectionData.projects.forEach((project) => {
      result[project.category] = (result[project.category] || 0) + 1;
    });
    return result;
  }, [sectionData.projects, sectionData.allLabel]);

  // If the selected category no longer exists (for example a project was deleted), go back to "All"
  const selectedCategory = categories.includes(activeCategory)
    ? activeCategory
    : sectionData.allLabel;

  const visibleProjects =
    selectedCategory === sectionData.allLabel
      ? sectionData.projects
      : sectionData.projects.filter((project) => project.category === selectedCategory);

  const isLoading = loading && backendProjects.length === 0;
  const hasError = Boolean(error) && backendProjects.length === 0;
  const showFilters = categories.length > 2;

  return (
    <Box component="section" id="projects" sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        {/* Heading */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "flex-end" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            {sectionData.eyebrow && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.75,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "999px",
                  border: `1px solid ${colors.border}`,
                  background: tint(isDark),
                  color: colors.muted,
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                <Box
                  aria-hidden
                  sx={{ width: 6, height: 6, borderRadius: "50%", background: colors.accent }}
                />
                {sectionData.eyebrow}
              </Box>
            )}

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

            <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: { xs: 16, md: 17 } }}>
              {sectionData.subtitle}
            </Typography>
          </Box>

          {sectionData.projects.length > 0 && (
            <Typography sx={{ color: colors.muted, fontSize: 14, fontWeight: 500 }}>
              {sectionData.projects.length}{" "}
              {sectionData.projects.length === 1 ? "project" : "projects"}
            </Typography>
          )}
        </Box>

        {isLoading ? (
          <ProjectSkeletons colors={colors} isDark={isDark} />
        ) : hasError ? (
          <Message
            action={
              <Button
                onClick={refreshData}
                variant="outlined"
                sx={{ color: colors.text, borderColor: colors.border, textTransform: "none" }}
              >
                Try again
              </Button>
            }
          >
            <Typography sx={{ color: colors.muted }}>{error}</Typography>
          </Message>
        ) : sectionData.projects.length === 0 ? (
          <Message>
            <Typography sx={{ color: colors.muted }}>{sectionData.emptyLabel}</Typography>
          </Message>
        ) : (
          <>
            {/* Category filters (sirf tab jab ek se zyada category ho) */}
            {showFilters && (
              <Box
                role="group"
                aria-label="Filter projects by category"
                sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 1 }}
              >
                {categories.map((category) => {
                  const selected = category === selectedCategory;

                  return (
                    <Button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={selected}
                      sx={{
                        pl: 2,
                        pr: 1.25,
                        py: 0.6,
                        minWidth: 0,
                        gap: 1,
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
                        ...focusOutline(colors),
                      }}
                    >
                      {category}
                      <Box
                        component="span"
                        sx={{
                          minWidth: 20,
                          px: 0.75,
                          borderRadius: "999px",
                          fontSize: 11.5,
                          fontWeight: 700,
                          lineHeight: "20px",
                          textAlign: "center",
                          color: selected ? "#fff" : colors.muted,
                          background: selected ? "rgba(255,255,255,0.22)" : tint(isDark, 1.4),
                        }}
                      >
                        {counts[category] || 0}
                      </Box>
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* Cards in a carousel (it starts again from the first card when the filter changes) */}
            <Box sx={{ mt: showFilters ? 3 : 4 }}>
              <Carousel key={selectedCategory} colors={colors} label="Projects">
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project._id || project.id || `${project.title}-${index}`}
                    project={project}
                    index={index}
                    data={sectionData}
                    colors={colors}
                    isDark={isDark}
                  />
                ))}
              </Carousel>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}