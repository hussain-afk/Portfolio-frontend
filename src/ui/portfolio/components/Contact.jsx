import React, { useState } from "react";
import { Box, Container, Typography, Button, IconButton, TextField } from "@mui/material";
import {
  MailOutlineRounded,
  PhoneOutlined,
  PlaceOutlined,
  GitHub,
  LinkedIn,
  SendRounded,
  CheckCircleOutlineRounded,
  ErrorOutlineRounded,
} from "@mui/icons-material";
import { getColors } from "../../getColors";

// ======================================================================
// EDIT ONLY THIS OBJECT to customize the Contact section.
//
// How the form sends messages:
// - If `formEndpoint` is set (e.g. a Formspree URL like
//   "https://formspree.io/f/yourFormId"), the form posts to it.
// - If it is left empty, the form opens the visitor's email app with the
//   message pre-filled, addressed to `email`.
// ======================================================================
const contactData = {
  title: "Contact",
  subtitle:
    "Have a project in mind or want to work together? Send me a message and I'll reply within a day or two.",

  email: "you@example.com",
  formEndpoint: "",

  // Contact details (icon is optional, href makes the value a link)
  methods: [
    { label: "Email", value: "you@example.com", href: "mailto:you@example.com", icon: <MailOutlineRounded /> },
    { label: "Phone", value: "+92 300 0000000", href: "tel:+923000000000", icon: <PhoneOutlined /> },
    { label: "Location", value: "Your city, Country", icon: <PlaceOutlined /> },
  ],

  socials: [
    { label: "GitHub", href: "https://github.com/your-username", icon: <GitHub /> },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-username", icon: <LinkedIn /> },
  ],

  // Form fields: add, remove or reorder. `multiline` makes a textarea.
  formTitle: "Send a message",
  submitLabel: "Send message",
  fields: [
    { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Your email", type: "email", required: true, autoComplete: "email" },
    { name: "subject", label: "Subject", type: "text", required: false },
    { name: "message", label: "Message", type: "text", required: true, multiline: true, rows: 5 },
  ],

  messages: {
    sending: "Sending your message...",
    success: "Thanks! Your message was sent. I'll get back to you soon.",
    error: "Something went wrong. Please try again or email me directly.",
  },

  footerText: "Hussain. Built with React and Material UI.",
};
// ======================================================================

export default function Contact({ isDark = true, data = contactData }) {
  const colors = getColors(isDark);

  const emptyValues = data.fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});
  const [values, setValues] = useState(emptyValues);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const focusRing = {
    "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
  };

  const fieldSx = {
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
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (status !== "idle" && status !== "sending") setStatus("idle");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // No endpoint: open the visitor's email app with the message filled in
    if (!data.formEndpoint) {
      const subject = values.subject || `Message from ${values.name || "your portfolio"}`;
      const body = data.fields
        .filter((f) => f.name !== "subject")
        .map((f) => `${f.label}: ${values[f.name]}`)
        .join("\n");
      window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(data.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setStatus("success");
        setValues(emptyValues);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const statusText = status === "idle" ? "" : data.messages[status];

  return (
    <Box
      component="section"
      id="contact"
      sx={{ scrollMarginTop: 90, pt: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            gap: { xs: 6, md: 8 },
            alignItems: "start",
          }}
        >
          {/* Left: intro + details */}
          <Box>
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
            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 440,
                color: colors.muted,
                fontSize: { xs: 16, md: 17 },
                lineHeight: 1.7,
              }}
            >
              {data.subtitle}
            </Typography>

            <Box sx={{ mt: 4, display: "grid", gap: 2.25 }}>
              {data.methods.map((item) => (
                <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
                  {item.icon && (
                    <Box
                      aria-hidden
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        borderRadius: "11px",
                        color: colors.accent,
                        border: `1px solid ${colors.border}`,
                        "& svg": { fontSize: 20 },
                      }}
                    >
                      {item.icon}
                    </Box>
                  )}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: colors.muted, fontSize: 13 }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ color: colors.text, fontSize: 16, fontWeight: 600, wordBreak: "break-word" }}>
                      {item.href ? (
                        <Box
                          component="a"
                          href={item.href}
                          sx={{
                            color: "inherit",
                            textDecoration: "none",
                            borderRadius: "4px",
                            "&:hover": { color: colors.accent },
                            ...focusRing,
                          }}
                        >
                          {item.value}
                        </Box>
                      ) : (
                        item.value
                      )}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: 4, display: "flex", gap: 1 }}>
              {data.socials.map((item) => (
                <IconButton
                  key={item.label}
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  sx={{
                    color: colors.muted,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "10px",
                    "&:hover": { color: colors.text, background: colors.hover },
                    ...focusRing,
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Right: form */}
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
            <Typography
              component="h3"
              sx={{ color: colors.text, fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}
            >
              {data.formTitle}
            </Typography>

            <Box sx={{ mt: 3, display: "grid", gap: 2.25 }}>
              {data.fields.map((field) => (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  required={field.required}
                  multiline={field.multiline}
                  rows={field.multiline ? field.rows || 4 : undefined}
                  autoComplete={field.autoComplete}
                  value={values[field.name]}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldSx}
                />
              ))}
            </Box>

            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
              <Button
                type="submit"
                disabled={status === "sending"}
                endIcon={<SendRounded />}
                sx={{
                  px: 3,
                  py: 1.3,
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  background: colors.accentSolid,
                  boxShadow: "none",
                  "&:hover": { background: colors.accentSolidHover, boxShadow: "none" },
                  "&.Mui-disabled": { color: "rgba(255,255,255,0.7)", background: colors.accentSolid, opacity: 0.6 },
                  ...focusRing,
                }}
              >
                {data.submitLabel}
              </Button>

              {/* Announced to screen readers when the status changes */}
              <Box role="status" aria-live="polite" sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                {status === "success" && <CheckCircleOutlineRounded sx={{ fontSize: 20, color: colors.success }} />}
                {status === "error" && <ErrorOutlineRounded sx={{ fontSize: 20, color: "#ef4444" }} />}
                {statusText && (
                  <Typography
                    sx={{
                      fontSize: 14,
                      color:
                        status === "success"
                          ? colors.success
                          : status === "error"
                          ? "#ef4444"
                          : colors.muted,
                    }}
                  >
                    {statusText}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}