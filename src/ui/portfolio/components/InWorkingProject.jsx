import { useMemo, useState, useContext } from "react";
import { Box, Container, Typography, Button, Chip } from "@mui/material";
import { GitHub, OpenInNewRounded, ConstructionOutlined } from "@mui/icons-material";
import { getColors } from "../../getColors";
import { Context } from "../../../context/Context.jsx";
import Carousel from "./Carousel";

// Section settings
const inWorkingData = {
  title: "Currently building",
  subtitle: "Projects I'm working on right now.",
  badgeLabel: "In progress",
  maxTechChips: 4,
  liveLabel: "Live preview",
  sourceLabel: "Source code",
};

// Make backend data safe, so a card never breaks
function normalizeProject(project = {}) {
  const rawTech = project.tech ?? project.technologies ?? project.skills ?? [];

  return {
    ...project,
    title: project.title || project.name || "Untitled Project",
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
/* Card styles (same look as the Projects cards)                        */
/* ------------------------------------------------------------------ */

// Frosted-glass pill (the "In progress" badge)
const glassSx = {
  background: "rgba(15, 23, 42, 0.55)",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

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

// One card: image background + dark layer + clean text
function InWorkingCard({ project, data, colors }) {
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
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 22px 44px rgba(0,0,0,0.35)" },
        "&:hover .working-image": { transform: "scale(1.05)" },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
          "&:hover .working-image": { transform: "none" },
        },
      }}
    >
      {/* Layer 1: project image (or a faint icon when there is no image) */}
      {hasImage ? (
        <Box
          className="working-image"
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
        <ConstructionOutlined
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
        {/* Top: "In progress" badge with a soft pulsing amber dot */}
        <Box>
          <Box
            component="span"
            sx={{
              ...glassSx,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: "999px",
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: "0.2px",
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#fbbf24",
                boxShadow: "0 0 0 0 rgba(251,191,36,0.6)",
                animation: "working-pulse 1.8s ease-out infinite",
                "@keyframes working-pulse": {
                  "0%": { boxShadow: "0 0 0 0 rgba(251,191,36,0.55)" },
                  "100%": { boxShadow: "0 0 0 8px rgba(251,191,36,0)" },
                },
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            />
            {data.badgeLabel}
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

// "Currently building" section, filled from the context (key: inWorkingProjects)
export default function InWorkingProject({ isDark = true, data = inWorkingData }) {
  const colors = getColors(isDark);
  const sectionData = { ...inWorkingData, ...data };

  const { inWorkingProjects, loading = false, errors = {}, refreshData } = useContext(Context) || {};

  // Supports [ ... ] or { inWorkingProjects: [ ... ] }
  const list = Array.isArray(inWorkingProjects)
    ? inWorkingProjects
    : Array.isArray(inWorkingProjects?.inWorkingProjects)
    ? inWorkingProjects.inWorkingProjects
    : [];

  const projects = useMemo(() => list.map(normalizeProject), [list]);

  if (loading && projects.length === 0) {
    return (
      <Box component="section" aria-label="Currently building" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 }, display: "flex", justifyContent: "center" }}>
          <Typography role="status" sx={{ color: colors.muted }}>Loading current projects...</Typography>
        </Container>
      </Box>
    );
  }

  if (errors.inWorkingProjects && projects.length === 0) {
    return (
      <Box component="section" aria-label="Currently building" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 }, display: "grid", justifyItems: "center", gap: 1.5 }}>
          <Typography role="alert" sx={{ color: colors.muted }}>{errors.inWorkingProjects}</Typography>
          <Button onClick={refreshData} variant="outlined" sx={{ color: colors.text, borderColor: colors.border, textTransform: "none" }}>
            Try again
          </Button>
        </Container>
      </Box>
    );
  }

  // Nothing in progress: hide the whole section
  if (projects.length === 0) return null;

  return (
    <Box
      component="section"
      id="in-progress"
      sx={{
        scrollMarginTop: 90,
        pt: { xs: 8, md: 12 },
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

        <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: { xs: 16, md: 17 } }}>
          {sectionData.subtitle}
        </Typography>

        {/* Cards in a carousel */}
        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <Carousel colors={colors} label="Projects in progress">
            {projects.map((project, index) => (
              <InWorkingCard
                key={project._id || project.id || `${project.title}-${index}`}
                project={project}
                data={sectionData}
                colors={colors}
              />
            ))}
          </Carousel>
        </Box>
      </Container>
    </Box>
  );
}