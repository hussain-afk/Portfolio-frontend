import { useContext, useState } from "react";
import { Box, Button, IconButton, TextField, Typography, CircularProgress } from "@mui/material";
import { AddRounded, DeleteOutlineRounded, SaveRounded } from "@mui/icons-material";
import { Context } from "../../../context/Context.jsx";
import { getColors } from "../../getColors";
import { getFieldSx, StatusMessage } from "./FormUI";
import { updatePortfolioSections } from "../../../api/admin.api.js";

const emptySections = {
  experiences: [],
  services: [],
  testimonials: [],
  faqs: [],
};

const fields = [
  {
    key: "experiences",
    label: "Experience",
    addLabel: "Add experience",
    fields: [
      { key: "period", label: "Period", placeholder: "2025 - Present" },
      { key: "role", label: "Role", placeholder: "MERN Stack Developer" },
      { key: "company", label: "Company", placeholder: "Freelance" },
      { key: "description", label: "Description", placeholder: "Describe your responsibilities and achievements", multiline: true },
    ],
  },
  {
    key: "services",
    label: "Services",
    addLabel: "Add service",
    fields: [
      { key: "title", label: "Service title", placeholder: "Frontend Development" },
      { key: "description", label: "Description", placeholder: "What do you offer?", multiline: true },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    addLabel: "Add testimonial",
    fields: [
      { key: "name", label: "Client name", placeholder: "Client Name" },
      { key: "role", label: "Role or company", placeholder: "Project Manager" },
      { key: "quote", label: "Recommendation", placeholder: "Write the testimonial", multiline: true },
    ],
  },
  {
    key: "faqs",
    label: "Frequently Asked Questions",
    addLabel: "Add FAQ",
    fields: [
      { key: "question", label: "Question", placeholder: "Are you available for freelance work?" },
      { key: "answer", label: "Answer", placeholder: "Yes, I am available for remote projects.", multiline: true },
    ],
  },
];

export default function PortfolioSectionsSettings({ isDark = true }) {
  const colors = getColors(isDark);
  const { portfolioSections, setPortfolioSections } = useContext(Context);
  const [form, setForm] = useState(() => ({
    ...emptySections,
    ...(portfolioSections || {}),
  }));
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const updateItem = (sectionKey, itemIndex, fieldKey, value) => {
    setForm((current) => ({
      ...current,
      [sectionKey]: current[sectionKey].map((item, index) =>
        index === itemIndex ? { ...item, [fieldKey]: value } : item
      ),
    }));
  };

  const addItem = (section) => {
    const emptyItem = Object.fromEntries(section.fields.map(({ key }) => [key, ""]));
    setForm((current) => ({
      ...current,
      [section.key]: [...(current[section.key] || []), emptyItem],
    }));
  };

  const removeItem = (sectionKey, itemIndex) => {
    setForm((current) => ({
      ...current,
      [sectionKey]: current[sectionKey].filter((_, index) => index !== itemIndex),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    const payload = {};
    for (const section of fields) {
      payload[section.key] = (form[section.key] || []).map((item) =>
        Object.fromEntries(section.fields.map(({ key }) => [key, (item[key] || "").trim()]))
      );
      const incomplete = payload[section.key].some((item) =>
        section.fields.some(({ key }) => !item[key])
      );
      if (incomplete) {
        setStatus({ type: "error", text: `Please complete every ${section.label} item.` });
        return;
      }
    }

    setSaving(true);
    try {
      const saved = await updatePortfolioSections(payload);
      setPortfolioSections(saved);
      setStatus({ type: "success", text: "Portfolio sections updated successfully." });
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Unable to update portfolio sections." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: "18px", background: colors.card, border: `1px solid ${colors.border}` }}>
      <Typography sx={{ color: colors.text, fontSize: 19, fontWeight: 700 }}>Experience, services, testimonials & FAQ</Typography>
      <Typography sx={{ mt: 0.5, color: colors.muted, fontSize: 14 }}>
        Add, edit or remove items for the homepage. Empty sections are hidden automatically.
      </Typography>
      {status && <Box sx={{ mt: 2 }}><StatusMessage colors={colors} message={status} onClose={() => setStatus(null)} /></Box>}

      <Box sx={{ mt: 3, display: "grid", gap: 2.25 }}>
        {fields.map((section) => (
          <Box
            key={section.key}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: "14px",
              border: `1px solid ${colors.border}`,
              background: colors.bg,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
              <Box>
                <Typography sx={{ color: colors.text, fontSize: 16, fontWeight: 700 }}>{section.label}</Typography>
                <Typography sx={{ mt: 0.25, color: colors.muted, fontSize: 12.5 }}>
                  {(form[section.key] || []).length} {(form[section.key] || []).length === 1 ? "item" : "items"}
                </Typography>
              </Box>
              <Button
                type="button"
                startIcon={<AddRounded />}
                onClick={() => addItem(section)}
                sx={{ px: 1.5, py: 0.7, borderRadius: "10px", color: colors.text, border: `1px solid ${colors.border}`, textTransform: "none", "&:hover": { background: colors.hover } }}
              >
                {section.addLabel}
              </Button>
            </Box>

            <Box sx={{ display: "grid", gap: 2 }}>
              {(form[section.key] || []).map((item, itemIndex) => (
                <Box
                  key={`${section.key}-${itemIndex}`}
                  sx={{
                    position: "relative",
                    p: 2,
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                    background: colors.card,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography sx={{ color: colors.muted, fontSize: 12.5, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      {section.label} {itemIndex + 1}
                    </Typography>
                    <IconButton
                      type="button"
                      aria-label={`Remove ${section.label} ${itemIndex + 1}`}
                      onClick={() => removeItem(section.key, itemIndex)}
                      sx={{ color: "#ef4444", "&:hover": { background: "rgba(239,68,68,0.10)" } }}
                    >
                      <DeleteOutlineRounded />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: section.fields.length >= 3 ? "1fr 1fr" : "1fr" }, gap: 1.5 }}>
                    {section.fields.map((field) => (
                      <TextField
                        key={field.key}
                        label={field.label}
                        placeholder={field.placeholder}
                        value={item[field.key] || ""}
                        onChange={(event) => updateItem(section.key, itemIndex, field.key, event.target.value)}
                        required
                        multiline={Boolean(field.multiline)}
                        minRows={field.multiline ? 3 : undefined}
                        fullWidth
                        sx={{
                          ...getFieldSx(colors),
                          ...(field.key === "description" || field.key === "quote" || field.key === "answer"
                            ? { gridColumn: "1 / -1" }
                            : {}),
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
        <Button
          type="submit"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveRounded />}
          sx={{ justifySelf: "start", px: 2.5, py: 1.2, borderRadius: "12px", color: "#fff", textTransform: "none", background: colors.accentSolid, "&:hover": { background: colors.accentSolidHover } }}
        >
          {saving ? "Saving..." : "Save sections"}
        </Button>
      </Box>
    </Box>
  );
}
