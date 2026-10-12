import { useContext, useState } from "react";
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
  CircularProgress,
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

const certificationsData = {
  title: "Certifications",
  subtitle: "Courses and credentials I've completed to keep my skills sharp.",
  initialVisible: 6,
  maxSkillChips: 3,
  showAllLabel: "Show all certifications",
  showLessLabel: "Show fewer",
  viewLabel: "View certificate",
  verifyLabel: "Verify",
};

function normalizeCertificate(cert) {
  const skills = cert.skills ?? cert.technologies ?? [];
  return {
    ...cert,
    title: cert.title || cert.name || "Untitled Certificate",
    issuer: cert.issuer || cert.provider || cert.organization || "Certificate",
    date: cert.date || cert.issueDate || cert.createdAt || "",
    expires: cert.expires || cert.expiryDate || "",
    credentialId: cert.credentialId || cert.certificateId || "",
    credentialUrl: cert.credentialUrl || cert.certificateUrl || cert.verifyUrl || "",
    image: cert.image || cert.imageUrl || cert.certificateImage || cert.thumbnail || "",
    logo: cert.logo || cert.issuerLogo || "",
    skills: Array.isArray(skills)
      ? skills
      : typeof skills === "string"
        ? skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [],
  };
}

function CertCard({ cert, data, colors, onPreview }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(cert.image) && !imageFailed;
  const shownSkills = (cert.skills || []).slice(0, data.maxSkillChips);
  const hiddenCount = (cert.skills || []).length - shownSkills.length;

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
        "&:hover .cert-image": { transform: "scale(1.04)" },
        "&:hover .cert-overlay, &:focus-within .cert-overlay": { opacity: 0.88 },
        "@media (prefers-reduced-motion: reduce)": {
          "&:hover .cert-image": { transform: "none" },
        },
      }}
    >
      {hasImage ? (
        <Box
          className="cert-image"
          component="img"
          src={cert.image}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          {cert.logo && (
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 38,
                height: 38,
                flexShrink: 0,
                p: 0.5,
                borderRadius: "10px",
                background: "#fff",
              }}
            >
              <Box
                component="img"
                src={cert.logo}
                alt=""
                loading="lazy"
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
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
              {shownSkills.map((skill, index) => (
                <Chip
                  key={`${skill}-${index}`}
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
  const { certificates, loading = false, errors = {}, refreshData } = useContext(Context) || {};
  const error = errors.certificates;
  const [showAll, setShowAll] = useState(false);
  const [preview, setPreview] = useState(null);

  const contextCertificates = Array.isArray(certificates) ? certificates : [];
  const sectionData = {
    ...certificationsData,
    ...data,
    certifications: contextCertificates.map(normalizeCertificate),
  };

  const canCollapse = sectionData.certifications.length > sectionData.initialVisible;
  const visible = showAll || !canCollapse
    ? sectionData.certifications
    : sectionData.certifications.slice(0, sectionData.initialVisible);

  const focusRing = {
    "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
  };

  return (
    <Box component="section" id="certifications" sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        <Typography
          component="h2"
          sx={{ color: colors.text, fontSize: { xs: 30, md: 40 }, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15 }}
        >
          {sectionData.title}
        </Typography>
        <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: { xs: 16, md: 17 } }}>
          {sectionData.subtitle}
        </Typography>

        {loading && contextCertificates.length === 0 ? (
          <Box role="status" sx={{ mt: 5, py: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <CircularProgress size={34} sx={{ color: colors.accent }} />
            <Typography sx={{ color: colors.muted, fontSize: 14 }}>Loading certificates...</Typography>
          </Box>
        ) : error && contextCertificates.length === 0 ? (
          <Box sx={{ mt: 5, py: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, textAlign: "center" }}>
            <Typography sx={{ color: colors.muted }}>{error}</Typography>
            <Button onClick={refreshData} variant="outlined" sx={{ color: colors.text, borderColor: colors.border, textTransform: "none" }}>
              Try again
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                mt: { xs: 5, md: 6 },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
                gap: 3,
              }}
            >
              {visible.map((cert, index) => (
                <CertCard
                  key={cert._id || cert.id || `${cert.issuer}-${cert.title}-${index}`}
                  cert={cert}
                  data={sectionData}
                  colors={colors}
                  onPreview={setPreview}
                />
              ))}
            </Box>

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
                  {showAll ? sectionData.showLessLabel : sectionData.showAllLabel}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>

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
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, fontSize: 17, fontWeight: 700 }}>
          <Box component="span" sx={{ minWidth: 0 }}>{preview?.title}</Box>
          <IconButton onClick={() => setPreview(null)} aria-label="Close" sx={{ color: colors.muted, flexShrink: 0, "&:hover": { background: colors.hover } }}>
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {preview?.image && (
            <Box
              component="img"
              src={preview.image}
              alt={`${preview.title} certificate from ${preview.issuer}`}
              sx={{ display: "block", mx: "auto", maxWidth: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: "10px" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
