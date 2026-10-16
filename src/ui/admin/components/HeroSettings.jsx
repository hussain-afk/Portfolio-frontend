import { useContext, useState } from "react";
import { Box, Button, Switch, TextField, Typography } from "@mui/material";
import { SaveRounded } from "@mui/icons-material";
import { updateHero } from "../../../api/admin.api.js";
import { Context } from "../../../context/Context.jsx";
import { getColors } from "../../getColors";
import { getFieldSx, StatusMessage } from "./FormUI";

const defaults = {
  avalaible: true,
  mainHeading: "I build fast, accessible interfaces for the web.",
  paragraph:
    "I'm Hussain, a Front-End & MERN Stack Developer based in Karachi. I work with React and Material UI to turn ideas into clean, responsive products.",
  autoWritingText: "Frontend Developer, Backend Developer, MERN Stack Developer",
};

export default function HeroSettings({ isDark = true }) {
  const colors = getColors(isDark);
  const { hero, setHero } = useContext(Context);
  const [form, setForm] = useState(() => ({ ...defaults, ...hero }));
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setSaving(true);
    try {
      const saved = await updateHero(form);
      setHero(saved);
      setStatus({ type: "success", text: "Hero section updated successfully." });
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Unable to update hero section." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: "18px",
        background: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Typography sx={{ color: colors.text, fontSize: 19, fontWeight: 700 }}>
        Hero content
      </Typography>
      <Typography sx={{ mt: 0.5, color: colors.muted, fontSize: 14 }}>
        Update the first section without touching the layout or theme.
      </Typography>
      {status && <Box sx={{ mt: 2 }}><StatusMessage colors={colors} message={status} onClose={() => setStatus(null)} /></Box>}

      <Box sx={{ mt: 3, display: "grid", gap: 2.25 }}>
        <TextField
          label="Main heading"
          value={form.mainHeading}
          onChange={updateField("mainHeading")}
          required
          fullWidth
          sx={getFieldSx(colors)}
        />
        <TextField
          label="Introduction"
          value={form.paragraph}
          onChange={updateField("paragraph")}
          required
          multiline
          minRows={3}
          fullWidth
          sx={getFieldSx(colors)}
        />
        <TextField
          label="Rotating roles"
          helperText="Separate roles with commas."
          value={form.autoWritingText}
          onChange={updateField("autoWritingText")}
          required
          fullWidth
          sx={getFieldSx(colors)}
        />
        <Box sx={{ display: "flex", alignItems: "center", color: colors.text }}>
          <Switch
            checked={form.avalaible}
            onChange={(event) => setForm((current) => ({ ...current, avalaible: event.target.checked }))}
            sx={{ ml: -1 }}
          />
          <Typography fontSize={14}>Available for new projects</Typography>
        </Box>
        <Button
          type="submit"
          disabled={saving}
          startIcon={<SaveRounded />}
          sx={{
            justifySelf: "start",
            px: 2.5,
            py: 1.2,
            borderRadius: "12px",
            color: "#fff",
            textTransform: "none",
            background: colors.accentSolid,
            "&:hover": { background: colors.accentSolidHover },
          }}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Box>
    </Box>
  );
}
