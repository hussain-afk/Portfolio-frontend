import { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import {
  CloudUploadOutlined,
  CheckCircleOutlineRounded,
  ErrorOutlineRounded,
  CloseRounded,
  RestartAltRounded,
} from "@mui/icons-material";

/* ------------------------------------------------------------------ */
/* Small pieces shared by AddProject and AddCertificate                  */
/* ------------------------------------------------------------------ */

// Style for every text field (same look as before)
export const getFieldSx = (colors) => ({
  "& .MuiOutlinedInput-root": {
    color: colors.text,
    borderRadius: "12px",
    background: colors.bg,
    "& fieldset": { borderColor: colors.border },
    "&:hover fieldset": { borderColor: colors.muted },
    "&.Mui-focused fieldset": { borderColor: colors.accent, borderWidth: 2 },
  },
  "& .MuiInputLabel-root": {
    color: colors.muted,
    "&.Mui-focused": { color: colors.accent },
  },
  "& .MuiFormHelperText-root": { color: colors.muted, marginLeft: 0.5 },
});

// Turns a chosen file into a temporary URL, so we can show a preview
export function usePreviewUrl(file) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setUrl("");
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}

// "a, b, c"  ->  ["a", "b", "c"]
export const splitList = (text) =>
  text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

// A card with a title (and a short note) that holds a group of fields
export function FormSection({ colors, title, subtitle, children }) {
  return (
    <Box sx={{ "& + &": { mt: 3.5, pt: 3.5, borderTop: `1px solid ${colors.border}` } }}>
      <Typography sx={{ color: colors.text, fontSize: 15, fontWeight: 700 }}>{title}</Typography>
      {subtitle && (
        <Typography sx={{ mt: 0.25, color: colors.muted, fontSize: 13 }}>{subtitle}</Typography>
      )}
      <Box
        sx={{
          mt: 2.25,
          display: "grid",
          gap: 2.25,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

// Click or drag an image here. Shows a small preview once a file is chosen.
export function FileUpload({ colors, label, hint, file, onChange, required = false }) {
  const [dragging, setDragging] = useState(false);
  const previewUrl = usePreviewUrl(file);

  const choose = (chosen) => {
    if (chosen && chosen.type.startsWith("image/")) onChange(chosen);
  };

  return (
    <Box sx={{ gridColumn: "1 / -1" }}>
      <Typography sx={{ mb: 0.75, color: colors.text, fontSize: 13.5, fontWeight: 600 }}>
        {label}
        {required && <Box component="span" sx={{ color: "#ef4444" }}> *</Box>}
      </Typography>

      <Box
        component="label"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          choose(e.dataTransfer.files[0]);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          cursor: "pointer",
          borderRadius: "14px",
          background: dragging ? colors.hover : colors.bg,
          border: `1.5px dashed ${dragging ? colors.accent : colors.border}`,
          transition: "border-color 200ms ease, background 200ms ease",
          "&:hover": { borderColor: colors.muted },
          "&:focus-within": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
        }}
      >
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            choose(e.target.files[0]);
            e.target.value = ""; // lets the same file be picked again
          }}
        />

        {file ? (
          <>
            <Box
              component="img"
              src={previewUrl}
              alt=""
              sx={{ width: 64, height: 64, flexShrink: 0, borderRadius: "10px", objectFit: "cover" }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap sx={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>
                {file.name}
              </Typography>
              <Typography sx={{ color: colors.muted, fontSize: 12.5 }}>
                {(file.size / 1024).toFixed(0)} KB · Click to change
              </Typography>
            </Box>
            <IconButton
              aria-label={`Remove ${label}`}
              onClick={(e) => {
                e.preventDefault(); // do not open the file picker
                onChange(null);
              }}
              sx={{ color: colors.muted, "&:hover": { background: colors.hover } }}
            >
              <CloseRounded />
            </IconButton>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: "12px",
                background: colors.hover,
                color: colors.accent,
              }}
            >
              <CloudUploadOutlined />
            </Box>
            <Box>
              <Typography sx={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>
                Click to upload or drag and drop
              </Typography>
              <Typography sx={{ color: colors.muted, fontSize: 12.5 }}>{hint}</Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

// Green "success" or red "error" box
export function StatusMessage({ colors, message, onClose }) {
  if (!message) return null;
  const isError = message.type === "error";
  const tone = isError ? "#ef4444" : "#22c55e";

  return (
    <Box
      role={isError ? "alert" : "status"}
      sx={{
        gridColumn: "1 / -1",
        display: "flex",
        alignItems: "flex-start",
        gap: 1.25,
        p: 1.5,
        borderRadius: "12px",
        color: tone,
        border: `1px solid ${tone}55`,
        background: `${tone}14`,
      }}
    >
      {isError ? <ErrorOutlineRounded fontSize="small" /> : <CheckCircleOutlineRounded fontSize="small" />}
      <Typography sx={{ flex: 1, fontSize: 14, lineHeight: 1.5 }}>{message.text}</Typography>
      <IconButton size="small" aria-label="Dismiss" onClick={onClose} sx={{ color: "inherit", p: 0.25 }}>
        <CloseRounded fontSize="small" />
      </IconButton>
    </Box>
  );
}

// Bottom row: Reset + Save (with a spinner while saving)
export function FormActions({ colors, loading, submitLabel, onReset }) {
  return (
    <Box
      sx={{
        mt: 3.5,
        pt: 3,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        gap: 1.5,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <Button
        type="button"
        onClick={onReset}
        disabled={loading}
        startIcon={<RestartAltRounded />}
        sx={{
          px: 2.25,
          py: 1.1,
          borderRadius: "12px",
          fontWeight: 600,
          textTransform: "none",
          color: colors.text,
          border: `1px solid ${colors.border}`,
          "&:hover": { background: colors.hover },
        }}
      >
        Reset
      </Button>

      <Button
        type="submit"
        disabled={loading}
        sx={{
          minWidth: 160,
          px: 3,
          py: 1.1,
          borderRadius: "12px",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          background: colors.accentSolid,
          "&:hover": { background: colors.accentSolidHover },
          "&.Mui-disabled": { color: "rgba(255,255,255,0.7)", background: colors.accentSolid, opacity: 0.7 },
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : submitLabel}
      </Button>
    </Box>
  );
}

// Frame around the live preview (title + sticky on big screens)
export function PreviewPanel({ colors, children }) {
  return (
    <Box sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
      <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
        <Typography sx={{ color: colors.text, fontSize: 14, fontWeight: 700 }}>Live preview</Typography>
      </Box>
      {children}
      <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: 12.5 }}>
        This is how it will look on your portfolio. It updates as you type.
      </Typography>
    </Box>
  );
}

// The white-ish panel that holds a whole form
export function FormCard({ colors, title, subtitle, icon, children, ...props }) {
  return (
    <Box
      {...props}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: "18px",
        background: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.75 }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: "12px",
            background: colors.hover,
            color: colors.accent,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            component="h2"
            sx={{ color: colors.text, fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px" }}
          >
            {title}
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 13.5 }}>{subtitle}</Typography>
        </Box>
      </Box>
      {children}
    </Box>
  );
}