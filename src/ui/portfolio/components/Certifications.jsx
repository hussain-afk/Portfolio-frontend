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
  VisibilityOutlined,
  CloseRounded,
} from "@mui/icons-material";
import { getColors } from "../../getColors";
import { Context } from "../../../context/Context.jsx";
import Carousel from "./Carousel";

// ======================================================================
// EDIT ONLY THIS OBJECT to customize the Certifications section.
// - The certificates themselves come from the context (key: `certificates`).
//   The list inside `certifications` below is only a SAMPLE, used when the
//   context has no `certificates` key at all (for example while you are testing).
// - `image` is the picture of your certificate. It fills the whole card,
//   with a dark layer on top that holds the text.
//   (leave "" to show a plain dark card instead).
// - `logo` (small issuer logo), `credentialId`, `credentialUrl`, `expires`
//   and `skills` are optional. Leave them as "" (or []) to hide them.
// - `maxSkillChips` limits how many skill chips each card shows.
// ======================================================================
const certificationsData = {
  title: "Certifications",
  subtitle: "Courses and credentials I've completed to keep my skills sharp.",
  maxSkillChips: 3,
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

/* ------------------------------------------------------------------ */
/* Card styles (shared look, easy to tweak)                             */
/* ------------------------------------------------------------------ */

// Frosted-glass pill (top badge)
const glassSx = {
  background: "rgba(15, 23, 42, 0.55)",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

// Small chip with the skill name
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

// One certificate card: image background + dark layer + clean text
function CertCard({ cert, data, onPreview }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const hasImage = Boolean(cert.image) && !imageFailed;

  const skills = cert.skills || [];
  const shownSkills = skills.slice(0, data.maxSkillChips);
  const hiddenCount = skills.length - shownSkills.length;

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: { xs: 340, sm: 380 },
        borderRadius: "20px",
        // used when there is no image: dark gradient with a soft blue glow
        background:
          "radial-gradient(circle at 85% 0%, rgba(56,189,248,0.22) 0%, transparent 55%), linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        transition: "transform 300ms ease, box-shadow 300ms ease",
        // Hover: card lifts a little and the image zooms slowly
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 22px 44px rgba(0,0,0,0.35)" },
        "&:hover .cert-image": { transform: "scale(1.05)" },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
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
            transition: "transform 600ms ease",
          }}
        />
      ) : (
        <WorkspacePremiumOutlined
          aria-hidden
          sx={{
            position: "absolute",
            top: "18%",
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
            "linear-gradient(to top, rgba(2,6,23,0.96) 0%, rgba(2,6,23,0.78) 40%, rgba(2,6,23,0.2) 72%, rgba(2,6,23,0.45) 100%)",
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
        {/* Top: issuer badge */}
        <Box>
          <Box
            sx={{
              ...glassSx,
              display: "inline-flex",
              alignItems: "center",
              gap: 1.25,
              maxWidth: "100%",
              p: 0.75,
              pr: 1.75,
              borderRadius: "14px",
            }}
          >
            {cert.logo && (
              <Box
                aria-hidden
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  overflow: "hidden",
                  borderRadius: "10px",
                  background: logoFailed ? "rgba(255,255,255,0.16)" : "transparent",
                }}
              >
                {logoFailed ? (
                  // The logo link is broken: show the first letter of the issuer instead
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
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
            <Box sx={{ minWidth: 0, pl: cert.logo ? 0 : 1 }}>
              <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>
                {cert.issuer}
              </Typography>
              <Typography noWrap sx={{ fontSize: 12, color: "rgba(255,255,255,0.72)" }}>
                {cert.date}
                {cert.expires ? ` · Expires ${cert.expires}` : ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Bottom: title, id, skills, buttons */}
        <Box>
          <Typography
            component="h3"
            title={cert.title}
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: "-0.3px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {cert.title}
          </Typography>

          {cert.credentialId && (
            <Typography
              sx={{
                mt: 0.75,
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, monospace",
              }}
            >
              ID: {cert.credentialId}
            </Typography>
          )}

          {shownSkills.length > 0 && (
            <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 0.6 }}>
              {shownSkills.map((skill) => (
                <Chip key={skill} label={skill} size="small" sx={chipSx} />
              ))}
              {hiddenCount > 0 && <Chip label={`+${hiddenCount}`} size="small" sx={chipSx} />}
            </Box>
          )}

          {(hasImage || cert.credentialUrl) && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {hasImage && (
                <Button
                  onClick={() => onPreview(cert)}
                  startIcon={<VisibilityOutlined sx={{ fontSize: 17 }} />}
                  aria-label={`${data.viewLabel}: ${cert.title}`}
                  sx={buttonSx(true)}
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
                  sx={buttonSx(!hasImage)}
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

        {/* Cards in a carousel */}
        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <Carousel colors={colors} label="Certifications">
            {certifications.map((cert, index) => (
              <CertCard
                key={cert._id || cert.id || `${cert.issuer}-${cert.title}-${index}`}
                cert={cert}
                data={data}
                onPreview={setPreview}
              />
            ))}
          </Carousel>
        </Box>
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