import { useState } from "react";
import { Box, Container, Typography, Button, IconButton, TextField, CircularProgress } from "@mui/material";
import {
  MailOutlineRounded,
  PhoneOutlined,
  PlaceOutlined,
  GitHub,
  LinkedIn,
  SendRounded,
} from "@mui/icons-material";
import  useAdmin  from "../../../hooks/useAdmin";
import { getColors } from "../../getColors";
import { links } from '../../../config/config.js'

// ======================================================================
// EDIT ONLY THIS OBJECT to change the text, contact details and links.
// Leave `href` out of a method to show it as plain text (e.g. Location).
// ======================================================================
const contactData = {
  title: "Contact",
  subtitle:
    "Have a project in mind or want to work together? Send me a message and I'll reply within a day or two.",
  methods: [
    { label: "Email", value: "hussainkadir245@gmail.com", href: "mailto:hussainkadir245@gmail.com", icon: <MailOutlineRounded /> },
    { label: "Phone", value: "+92 368044668", href: "tel:+92 368044668", icon: <PhoneOutlined /> },
    { label: "Location", value: "Karachi , Pakistan", icon: <PlaceOutlined /> },
  ],
  socials: [
    { label: "GitHub", href: links.github, icon: <GitHub /> },
    { label: "LinkedIn", href: links.linkedin, icon: <LinkedIn /> },
  ],
  formTitle: "Send a message",
  formNote: "I usually reply within 24 hours.",
  submitLabel: "Send message",
};
// ======================================================================

export default function Contact({ isDark = true, data = contactData }) {
  const { handleSendMessage } = useAdmin();
  const colors = getColors(isDark);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await handleSendMessage({ name, email, subject, message });
      setStatus({ type: "success", text: "Thanks! Your message was sent successfully." });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Unable to send your message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Box
      component="section"
      id="contact"
      sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}
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
          {/* Left: intro, details, social links */}
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

            <Box sx={{ mt: 4, display: "grid", gap: 1.5, maxWidth: 440 }}>
              {data.methods.map((item) => (
                <Box
                  key={item.label}
                  component={item.href ? "a" : "div"}
                  href={item.href}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.75,
                    p: 1.75,
                    textDecoration: "none",
                    borderRadius: "14px",
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    transition: "border-color 150ms ease",
                    ...(item.href && {
                      "&:hover": { borderColor: colors.accent },
                      ...focusRing,
                    }),
                  }}
                >
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
                      background: colors.hover,
                      "& svg": { fontSize: 20 },
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: colors.muted, fontSize: 13 }}>
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{ color: colors.text, fontSize: 15.5, fontWeight: 600, wordBreak: "break-word" }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: 3.5, display: "flex", gap: 1 }}>
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
            <Typography sx={{ mt: 0.5, color: colors.muted, fontSize: 14 }}>
              {data.formNote}
            </Typography>
            {status && (
              <Typography
                role={status.type === "error" ? "alert" : "status"}
                sx={{ mt: 2, color: status.type === "error" ? "#ef4444" : "#22c55e", fontSize: 14 }}
              >
                {status.text}
              </Typography>
            )}

            <Box sx={{ mt: 3, display: "grid", gap: 2.25 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2.25,
                }}
              >
                <TextField
                  name="name"
                  label="Your name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  name="email"
                  type="email"
                  label="Your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  sx={fieldSx}
                />
              </Box>

              <TextField
                name="subject"
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                sx={fieldSx}
              />

              <TextField
                name="message"
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                rows={5}
                required
                fullWidth
                sx={fieldSx}
              />

              <Button
                type="submit"
                endIcon={<SendRounded />}
                disabled={loading}
                sx={{
                  py: 1.3,
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  background: colors.accentSolid,
                  boxShadow: "none",
                  "&:hover": { background: colors.accentSolidHover, boxShadow: "none" },
                  ...focusRing,
                }}
              >
                {loading ? <CircularProgress size={21} color="inherit" /> : data.submitLabel}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}