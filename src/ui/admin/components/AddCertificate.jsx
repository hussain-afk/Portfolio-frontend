import { useState } from "react";
import { Box, Typography, TextField, Chip } from "@mui/material";
import { WorkspacePremiumOutlined } from "@mui/icons-material";
import { getColors } from "../../getColors";
import useAdmin from "../../../hooks/useAdmin";
import {
  getFieldSx,
  splitList,
  usePreviewUrl,
  FormCard,
  FormSection,
  FileUpload,
  StatusMessage,
  FormActions,
  PreviewPanel,
} from "./FormUI";

// Must match your backend route: upload.array("images", 2)
// The controller reads files[0] as the certificate image and files[1] as the logo.
const FILES_FIELD = "images";

/* ------------------------------------------------------------------ */
/* Live preview card (same look as the card on your portfolio)          */
/* ------------------------------------------------------------------ */

function CertificatePreview({ colors, values, imageUrl, logoUrl }) {
  const skills = splitList(values.skills);
  const shownSkills = skills.slice(0, 3);
  const hiddenCount = skills.length - shownSkills.length;

  const chipSx = {
    height: 22,
    color: "#fff",
    background: "rgba(255,255,255,0.16)",
    fontSize: 11.5,
    fontWeight: 500,
    borderRadius: "7px",
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
        aspectRatio: "4 / 3",
        borderRadius: "18px",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Layer 1: certificate image (or a faint icon) */}
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt=""
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: -2,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <WorkspacePremiumOutlined
          aria-hidden
          sx={{ position: "absolute", top: -18, right: -18, zIndex: -2, fontSize: 190, color: "rgba(255,255,255,0.07)" }}
        />
      )}

      {/* Layer 2: dark transparent layer */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.66) 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Layer 3: text */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2,
          p: 2.5,
          color: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          {logoUrl && (
            <Box
              sx={{
                width: 42,
                height: 42,
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <Box
                component="img"
                src={logoUrl}
                alt=""
                sx={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
              {values.issuer || "Issuer"}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)" }}>
              {values.date || "Date"}
              {values.expires ? ` · Expires ${values.expires}` : ""}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography
            component="h3"
            sx={{
              fontSize: 18,
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: "-0.2px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {values.title || "Certificate title"}
          </Typography>

          {values.credentialId && (
            <Typography sx={{ mt: 0.5, fontSize: 12.5, color: "rgba(255,255,255,0.78)" }}>
              Credential ID: {values.credentialId}
            </Typography>
          )}

          {shownSkills.length > 0 && (
            <Box sx={{ mt: 1.25, display: "flex", flexWrap: "wrap", gap: 0.6 }}>
              {shownSkills.map((skill) => (
                <Chip key={skill} label={skill} size="small" sx={chipSx} />
              ))}
              {hiddenCount > 0 && <Chip label={`+${hiddenCount}`} size="small" sx={chipSx} />}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                 */
/* ------------------------------------------------------------------ */

export default function AddCertificate({ isDark = true }) {
  const colors = getColors(isDark);
  const fieldSx = getFieldSx(colors);
  const { handleAddCertificate } = useAdmin();

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [expires, setExpires] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [skills, setSkills] = useState(""); // comma separated, e.g. React, JavaScript
  const [image, setImage] = useState(null); // certificate image (required)
  const [logo, setLogo] = useState(null); // issuer logo (optional)

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  const imageUrl = usePreviewUrl(image);
  const logoUrl = usePreviewUrl(logo);

  const resetForm = () => {
    setTitle("");
    setIssuer("");
    setDate("");
    setExpires("");
    setCredentialId("");
    setCredentialUrl("");
    setSkills("");
    setImage(null);
    setLogo(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!image) {
      setMessage({ type: "error", text: "Please choose the certificate image." });
      return;
    }

    // Files can only travel as multipart/form-data, not as a plain object
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("issuer", issuer.trim());
    formData.append("date", date.trim());
    if (expires.trim()) formData.append("expires", expires.trim());
    if (credentialId.trim()) formData.append("credentialId", credentialId.trim());
    if (credentialUrl.trim()) formData.append("credentialUrl", credentialUrl.trim());

    // "React, JavaScript" -> '["React","JavaScript"]'
    formData.append("skills", JSON.stringify(splitList(skills)));

    // Order matters: certificate image first, logo second
    formData.append(FILES_FIELD, image);
    if (logo) formData.append(FILES_FIELD, logo);

    setLoading(true);
    try {
      await handleAddCertificate(formData);
      setMessage({ type: "success", text: "Certificate added successfully." });
      resetForm();
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || error?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        alignItems: "start",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.3fr) minmax(0, 0.7fr)" },
      }}
    >
      {/* ---------- Form ---------- */}
      <FormCard
        component="form"
        onSubmit={handleSubmit}
        colors={colors}
        title="Add certificate"
        subtitle="Add a course or credential you completed."
        icon={<WorkspacePremiumOutlined />}
      >
        <FormSection colors={colors} title="Basic info" subtitle="What did you earn, and who gave it?">
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            sx={{ ...fieldSx, gridColumn: "1 / -1" }}
          />
          <TextField
            label="Issuer"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            required
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Mar 2025"
            required
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Expires"
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
            helperText="Optional"
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, JavaScript"
            fullWidth
            sx={fieldSx}
          />
        </FormSection>

        <FormSection colors={colors} title="Credential" subtitle="Let people verify it. All optional.">
          <TextField
            label="Credential ID"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Credential URL"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            fullWidth
            sx={fieldSx}
          />
        </FormSection>

        <FormSection colors={colors} title="Images" subtitle="The certificate is required. The logo is optional.">
          <FileUpload
            colors={colors}
            label="Certificate image"
            hint="PNG, JPG or WebP"
            file={image}
            onChange={setImage}
            required
          />
          <FileUpload
            colors={colors}
            label="Issuer logo (optional)"
            hint="A square logo works best"
            file={logo}
            onChange={setLogo}
          />
        </FormSection>

        {message && (
          <Box sx={{ mt: 3 }}>
            <StatusMessage colors={colors} message={message} onClose={() => setMessage(null)} />
          </Box>
        )}

        <FormActions colors={colors} loading={loading} submitLabel="Add certificate" onReset={resetForm} />
      </FormCard>

      {/* ---------- Live preview ---------- */}
      <PreviewPanel colors={colors}>
        <CertificatePreview
          colors={colors}
          values={{ title, issuer, date, expires, credentialId, skills }}
          imageUrl={imageUrl}
          logoUrl={logoUrl}
        />
      </PreviewPanel>
    </Box>
  );
}