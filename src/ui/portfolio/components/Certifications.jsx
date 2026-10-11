import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import {
  WorkspacePremiumOutlined,
  OpenInNewRounded,
  ExpandMoreRounded,
  ExpandLessRounded,
  VisibilityOutlined,
  CloseRounded,
} from "@mui/icons-material";
import { getColors } from "../../getColors";
import { Context } from "../../../context/Context.jsx";

// ======================================================================
// EDIT ONLY THIS OBJECT to customize the Certifications section.
// - The certificates themselves now come from the context (key: `certificates`).
//   The list inside `certifications` below is only a SAMPLE, used when the
//   context has no `certificates` key at all (for example while you are testing).
// - `image` is the picture of your certificate. It fills the whole card,
//   with a dark transparent layer on top that holds the text.
//   (leave "" to show a plain dark card instead).
// - `logo` (small issuer logo), `credentialId`, `credentialUrl`, `expires`
//   and `skills` are optional. Leave them as "" (or []) to hide them.
// - `initialVisible` is how many cards show before "Show all" appears.
//   If you have fewer certificates than this, the button is hidden.
// - `maxSkillChips` limits how many skill chips each card shows.
// ======================================================================
const certificationsData = {
  title: "Certifications",
  subtitle: "Courses and credentials I've completed to keep my skills sharp.",
  initialVisible: 6,
  maxSkillChips: 3,
  showAllLabel: "Show all certifications",
  showLessLabel: "Show fewer",
  viewLabel: "View certificate",
  verifyLabel: "Verify",

  certifications: [
    {
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera",
      date: "Mar 2025",
      expires: "",
      credentialId: "ABC123XYZ",
      credentialUrl: "https://example.com/credential/1",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS024MDOZQQjs2KPWtcSAefYqaJq715Bjw2Rv-hMbSlUCNVBSrKfiRBrWbl&s=10",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1HE51g1QFrOdlhF0eLqVjsYNknuh_bIdCYqjAj1sg3g&s=10",
      skills: ["React", "JavaScript", "UX basics"],
    },
    {
      title: "Responsive Web Design",
      issuer: "freeCodeCamp",
      date: "Nov 2024",
      expires: "",
      credentialId: "",
      credentialUrl: "https://example.com/credential/2",
      image: "",
      logo: "",
      skills: ["HTML", "CSS", "Flexbox", "Grid"],
    },
    {
      title: "JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      date: "Jan 2025",
      expires: "",
      credentialId: "",
      credentialUrl: "https://example.com/credential/3",
      image: "",
      logo: "",
      skills: ["JavaScript", "Algorithms"],
    },
    {
      title: "React - The Complete Guide",
      issuer: "Udemy",
      date: "Jun 2024",
      expires: "",
      credentialId: "UC-0000-0000",
      credentialUrl: "https://example.com/credential/4",
      image: "",
      logo: "",
      skills: ["React", "Hooks", "Redux"],
    },
    {
      title: "Google UX Design Certificate",
      issuer: "Google",
      date: "Aug 2024",
      expires: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
      logo: "",
      skills: ["Figma", "Prototyping"],
    },
    {
      title: "Git and GitHub Essentials",
      issuer: "LinkedIn Learning",
      date: "Feb 2024",
      expires: "",
      credentialId: "",
      credentialUrl: "https://example.com/credential/6",
      image: "",
      logo: "",
      skills: ["Git", "GitHub"],
    },
    {
      title: "Web Accessibility Fundamentals",
      issuer: "Udacity",
      date: "Sep 2025",
      expires: "",
      credentialId: "",
      credentialUrl: "https://example.com/credential/7",
      image: "",
      logo: "",
      skills: ["WCAG", "ARIA"],
    },
  ],
};
// ======================================================================

/* ------------------------------------------------------------------ */
/* Helpers: make data from the context safe to show                     */
/* ------------------------------------------------------------------ */

// Database dates look like "2025-03-01T00:00:00.000Z". Show them as "Mar 2025".
// Text that is already friendly (like "Mar 2025") is left as it is.
const formatCertDate = (value) => {
  if (!value) return "";
  if (typeof value === "string" && !/^\d{4}-\d{2}/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// Skills can be an array (["React", "CSS"]) or a text ("React, CSS")
const toSkillsArray = (skills) => {
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

// Fill every missing field, so a card never breaks
const normalizeCert = (cert = {}) => ({
  ...cert,
  title: cert.title || "Untitled certificate",
  issuer: cert.issuer || "",
  date: formatCertDate(cert.date),
  expires: formatCertDate(cert.expires),
  credentialId: cert.credentialId || "",
  credentialUrl: cert.credentialUrl || "",
  image: cert.image || "",
  logo: cert.logo || "",
  skills: toSkillsArray(cert.skills),
});

// One certificate card: image background + dark transparent layer + text
function CertCard({ cert, data, colors, onPreview }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const hasImage = Boolean(cert.image) && !imageFailed;

  const skills = cert.skills || [];
  const shownSkills = skills.slice(0, data.maxSkillChips);
  const hiddenCount = skills.length - shownSkills.length;

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
    "&:hover": { background: "rgba(255,255,255,0.2)" },
    "&:focus-visible": { outline: "2px solid #fff", outlineOffset: 2 },
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
        aspectRatio: { xs: "5 / 4", sm: "4 / 3" },
        borderRadius: "18px",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: `1px solid ${colors.border}`,
        // Hover: image zooms slightly and the dark layer softens
        "&:hover .cert-image": { transform: "scale(1.04)" },
        "&:hover .cert-overlay, &:focus-within .cert-overlay": { opacity: 0.88 },
        "@media (prefers-reduced-motion: reduce)": {
          "&:hover .cert-image": { transform: "none" },
        },
      }}
    >
      {/* Layer 1: certificate image (or a faint icon when there is no image) */}
      {hasImage ? (
        <Box
          className="cert-image"
          component="img"
          src={cert.image}
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
            transition: "transform 400ms ease",
          }}
        />
      ) : (
        <WorkspacePremiumOutlined
          aria-hidden
          sx={{
            position: "absolute",
            top: -18,
            right: -18,
            zIndex: -2,
            fontSize: 190,
            color: "rgba(255,255,255,0.07)",
          }}
        />
      )}

      {/* Layer 2: transparent black layer that the text sits on */}
      <Box
        className="cert-overlay"
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.66) 55%, rgba(0,0,0,0.5) 100%)",
          transition: "opacity 250ms ease",
        }}
      />

      {/* Layer 3: text and actions */}
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
        {/* Top: issuer + date */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          {cert.logo && (
            <Box
              aria-hidden
              sx={{
                display: "grid",
                placeItems: "center",
                width: 42,
                height: 42,
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: "10px",
                // no white background: the image itself fills the whole box
                background: logoFailed ? "rgba(255,255,255,0.16)" : "transparent",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {logoFailed ? (
                // The logo link is broken: show the first letter of the issuer instead
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
                  {(cert.issuer || cert.title).charAt(0).toUpperCase()}
                </Typography>
              ) : (
                <Box
                  component="img"
                  src={cert.logo}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setLogoFailed(true)}
                  sx={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
              {cert.issuer}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)" }}>
              {cert.date}
              {cert.expires ? ` · Expires ${cert.expires}` : ""}
            </Typography>
          </Box>
        </Box>

        {/* Bottom: title, id, skills, buttons */}
        <Box>
          <Typography
            component="h3"
            title={cert.title}
            sx={{
              fontSize: { xs: 17, sm: 18 },
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: "-0.2px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {cert.title}
          </Typography>

          {cert.credentialId && (
            <Typography sx={{ mt: 0.5, fontSize: 12.5, color: "rgba(255,255,255,0.78)" }}>
              Credential ID: {cert.credentialId}
            </Typography>
          )}

          {shownSkills.length > 0 && (
            <Box sx={{ mt: 1.25, display: "flex", flexWrap: "wrap", gap: 0.6 }}>
              {shownSkills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  sx={{
                    height: 22,
                    color: "#fff",
                    background: "rgba(255,255,255,0.16)",
                    fontSize: 11.5,
                    fontWeight: 500,
                    borderRadius: "7px",
                  }}
                />
              ))}
              {hiddenCount > 0 && (
                <Chip
                  label={`+${hiddenCount}`}
                  size="small"
                  sx={{
                    height: 22,
                    color: "#fff",
                    background: "rgba(255,255,255,0.16)",
                    fontSize: 11.5,
                    fontWeight: 500,
                    borderRadius: "7px",
                  }}
                />
              )}
            </Box>
          )}

          {(hasImage || cert.credentialUrl) && (
            <Box sx={{ mt: 1.75, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {hasImage && (
                <Button
                  onClick={() => onPreview(cert)}
                  startIcon={<VisibilityOutlined sx={{ fontSize: 17 }} />}
                  aria-label={`${data.viewLabel}: ${cert.title}`}
                  sx={overlayButtonSx}
                >
                  {data.viewLabel}
                </Button>
              )}
              {cert.credentialUrl && (
                <Button
                  component="a"
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewRounded sx={{ fontSize: 15 }} />}
                  aria-label={`${data.verifyLabel} credential for ${cert.title}`}
                  sx={overlayButtonSx}
                >
                  {data.verifyLabel}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function Certifications({ isDark = true, data = certificationsData }) {
  const colors = getColors(isDark);

  // Get the certificates from the context (key: `certificates`)
  const { certificates } = useContext(Context) || {};

  const [showAll, setShowAll] = useState(false);
  const [preview, setPreview] = useState(null);

  // The context can hold the list directly: certificates = [ {...}, {...} ]
  // or an object that has the list inside:   certificates = { certifications: [ ... ] }
  const list = Array.isArray(certificates)
    ? certificates
    : Array.isArray(certificates?.certifications)
    ? certificates.certifications
    : data.certifications; // key is missing: show the sample list

  const certifications = list.map(normalizeCert);

  // Nothing to show (the context list is empty): hide the whole section
  if (certifications.length === 0) return null;

  const canCollapse = certifications.length > data.initialVisible;
  const visible =
    showAll || !canCollapse ? certifications : certifications.slice(0, data.initialVisible);

  const focusRing = {
    "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
  };

  return (
    <Box
      component="section"
      id="certifications"
      sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}
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
          {data.title}
        </Typography>
        <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: { xs: 16, md: 17 } }}>
          {data.subtitle}
        </Typography>

        {/* Cards */}
        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {visible.map((cert, index) => (
            <CertCard
              key={cert._id || cert.id || `${cert.issuer}-${cert.title}-${index}`}
              cert={cert}
              data={data}
              colors={colors}
              onPreview={setPreview}
            />
          ))}
        </Box>

        {/* Show all / fewer */}
        {canCollapse && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => setShowAll((prev) => !prev)}
              aria-expanded={showAll}
              endIcon={showAll ? <ExpandLessRounded /> : <ExpandMoreRounded />}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: "12px",
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                color: colors.text,
                border: `1px solid ${colors.border}`,
                "&:hover": { background: colors.hover },
                ...focusRing,
              }}
            >
              {showAll ? data.showLessLabel : data.showAllLabel}
            </Button>
          </Box>
        )}
      </Container>

      {/* Full-size certificate viewer */}
      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        maxWidth="lg"
        fullWidth
        aria-labelledby="cert-preview-title"
        sx={{
          "& .MuiDialog-paper": {
            m: { xs: 1.5, sm: 3 },
            borderRadius: "16px",
            color: colors.text,
            background: colors.card,
            backgroundImage: "none",
            border: `1px solid ${colors.border}`,
          },
        }}
      >
        <DialogTitle
          id="cert-preview-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            fontSize: 17,
            fontWeight: 700,
          }}
        >
          <Box component="span" sx={{ minWidth: 0 }}>
            {preview?.title}
          </Box>
          <IconButton
            onClick={() => setPreview(null)}
            aria-label="Close"
            sx={{ color: colors.muted, flexShrink: 0, "&:hover": { background: colors.hover } }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {preview?.image && (
            <Box
              component="img"
              src={preview.image}
              referrerPolicy="no-referrer"
              alt={`${preview.title} certificate from ${preview.issuer}`}
              sx={{
                display: "block",
                mx: "auto",
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}