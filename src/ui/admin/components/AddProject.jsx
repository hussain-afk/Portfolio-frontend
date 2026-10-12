import { useState } from "react";
import { Box, Typography, TextField, Chip, Button } from "@mui/material";
import { FolderSpecialOutlined, OpenInNewRounded, GitHub, ImageOutlined } from "@mui/icons-material";
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

/* ------------------------------------------------------------------ */
/* Live preview card (shows how the project will look)                  */
/* ------------------------------------------------------------------ */

function ProjectPreview({ colors, values, imageUrl }) {
  const techList = splitList(values.tech);

  return (
    <Box
      component="article"
      sx={{
        overflow: "hidden",
        borderRadius: "18px",
        background: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Image (or a placeholder) */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16 / 10",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt=""
            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImageOutlined sx={{ fontSize: 56, color: "rgba(255,255,255,0.18)" }} />
        )}

        {values.category && (
          <Chip
            label={values.category}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              color: "#fff",
              fontWeight: 600,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
            }}
          />
        )}
      </Box>

      {/* Text */}
      <Box sx={{ p: 2.25 }}>
        <Typography
          component="h3"
          sx={{ color: colors.text, fontSize: 18, fontWeight: 700, letterSpacing: "-0.2px" }}
        >
          {values.title || "Project title"}
        </Typography>

        <Typography
          sx={{
            mt: 0.75,
            color: colors.muted,
            fontSize: 14,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {values.description || "Your short project description will appear here."}
        </Typography>

        {techList.length > 0 && (
          <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 0.6 }}>
            {techList.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                sx={{
                  height: 24,
                  fontSize: 12,
                  fontWeight: 500,
                  color: colors.text,
                  background: colors.hover,
                  borderRadius: "7px",
                }}
              />
            ))}
          </Box>
        )}

        {(values.liveUrl || values.githubUrl) && (
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            {values.liveUrl && (
              <Button
                size="small"
                endIcon={<OpenInNewRounded sx={{ fontSize: 15 }} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              >
                Live
              </Button>
            )}
            {values.githubUrl && (
              <Button
                size="small"
                startIcon={<GitHub sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              >
                Code
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                 */
/* ------------------------------------------------------------------ */

export default function AddProject({ isDark = true }) {
  const colors = getColors(isDark);
  const fieldSx = getFieldSx(colors);

  const { handleAddProject } = useAdmin();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState(""); // comma separated, e.g. React, MUI
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  const imageUrl = usePreviewUrl(image);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setTech("");
    setLiveUrl("");
    setGithubUrl("");
    setImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    // Same data as before, nothing changed here
    const projectData = {
      title,
      category,
      description,
      tech,
      liveUrl,
      githubUrl,
      image,
    };

    try {
      const response = await handleAddProject(projectData);
      console.log("Project added successfully:", response);
      setMessage({ type: "success", text: "Project added successfully." });
      resetForm();
    } catch (error) {
      console.error("Error adding project:", error);
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
        title="Add project"
        subtitle="Show your best work on your portfolio."
        icon={<FolderSpecialOutlined />}
      >
        <FormSection colors={colors} title="Basic info" subtitle="What is this project called?">
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Web app"
            required
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            required
            fullWidth
            sx={{ ...fieldSx, gridColumn: "1 / -1" }}
          />
        </FormSection>

        <FormSection colors={colors} title="Tech and links" subtitle="What you used and where to see it.">
          <TextField
            label="Tech (comma separated)"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            placeholder="React, MUI, Redux"
            fullWidth
            sx={{ ...fieldSx, gridColumn: "1 / -1" }}
          />
          <TextField
            label="Live URL"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="GitHub URL"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            fullWidth
            sx={fieldSx}
          />
        </FormSection>

        <FormSection colors={colors} title="Cover image" subtitle="A clear screenshot works best.">
          <FileUpload
            colors={colors}
            label="Project image"
            hint="PNG, JPG or WebP"
            file={image}
            onChange={setImage}
          />
        </FormSection>

        {message && (
          <Box sx={{ mt: 3 }}>
            <StatusMessage colors={colors} message={message} onClose={() => setMessage(null)} />
          </Box>
        )}

        <FormActions colors={colors} loading={loading} submitLabel="Add project" onReset={resetForm} />
      </FormCard>

      {/* ---------- Live preview ---------- */}
      <PreviewPanel colors={colors}>
        <ProjectPreview
          colors={colors}
          values={{ title, category, description, tech, liveUrl, githubUrl }}
          imageUrl={imageUrl}
        />
      </PreviewPanel>
    </Box>
  );
}