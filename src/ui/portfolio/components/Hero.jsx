import { Box, Container, Typography, Button, IconButton, Chip } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import resume from "../../../assets/Resume.pdf";
import {
  ArrowDownwardRounded,
  DownloadRounded,
  GitHub,
  LinkedIn,
  MailOutlineRounded,
} from "@mui/icons-material";
import { getColors } from "../../getColors";
import { Typewriter } from "react-simple-typewriter";
import { links } from '../../../config/config.js'

// ---- Edit your details here -------------------------------------------
const profile = {
  headline: "I build fast, accessible interfaces for the web.",
  intro:
    "I'm Hussain, a Front-End & MERN Stack Developer based in Karachi. I work with React and Material UI to turn ideas into clean, responsive products that are easy to use and easy to maintain.",
  cvHref: "/Hussain-CV.pdf", // put your CV inside the /public folder
  socials: [
    { label: "GitHub", href: links.github, icon: <GitHub /> },
    { label: "LinkedIn", href: links.linkedin, icon: <LinkedIn /> },
    { label: "Email", href: links.email, icon: <MailOutlineRounded /> },
  ],
  tech: ["React", "JavaScript", "Material UI", "HTML & CSS", "Git"],
};

// Code card content: [text, token type]
const codeLines = [
  [["const ", "keyword"], ["developer ", "plain"], ["= {", "punc"]],
  [["  name", "key"], [": ", "punc"], ['"Muhammad Hussain Memon"', "string"], [",", "punc"]],
  [["  role", "key"], [": ", "punc"], ['"FullStack Developer"', "string"], [",", "punc"]],
  [["  stack", "key"], [": [", "punc"], ['"React"', "string"], [", ", "punc"], ['"MONGODB"', "string"], [", ", "punc"], ['"Express"', "string"], [", ", "punc"], ['"Node.js"', "string"], ["],", "punc"]],
  [["  focus", "key"], [": ", "punc"], ['"Clean UI, fast pages"', "string"], [",", "punc"]],
  [["  openToWork", "key"], [": ", "punc"], ["true", "bool"], [",", "punc"]],
  [["};", "punc"]],
];
// -----------------------------------------------------------------------

// The one animated moment on the page: code lines appear one by one.
const lineIn = keyframes`
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export default function Hero({ isDark = true, data }) {
  const colors = getColors(isDark);
  const content = {
    ...profile,
    ...data,
    roles: data?.autoWritingText
      ? data.autoWritingText.split(",").map((item) => item.trim()).filter(Boolean)
      : ["Frontend Developer", "Backend Developer", "MERN Stack Developer"],
  };

  const focusRing = {
    "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
  };

  return (
    <Box
      component="section"
      id="home"
      sx={{
        scrollMarginTop: 90,
        minHeight: { xs: "auto", md: "calc(100vh - 96px)" },
        display: "flex",
        alignItems: "center",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            alignItems: "center",
            gap: { xs: 6, md: 8 },
          }}
        >
          {/* Left: text */}
          <Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
                px: 1.5,
                py: 0.6,
                borderRadius: "999px",
                border: `1px solid ${colors.border}`,
                color: colors.muted,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors.success,
                }}
              />
              {content.avalaible === false ? "Currently unavailable" : "Available for new projects"}
            </Box>

            <Typography
              component="h1"
              sx={{
                color: colors.text,
                fontSize: { xs: 38, sm: 48, md: 58 },
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: { xs: "-1.2px", md: "-2px" },
                maxWidth: 620,
              }}
            >
              {content.mainHeading || content.headline}
              
            </Typography>

            <Typography
              sx={{
                mt: 3,
                maxWidth: 540,
                color: colors.muted,
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.7,
              }}
            >
              {content.paragraph || content.intro}
              
            </Typography>
            <Typography
                component="h2"
                sx={{ color: colors.text, fontSize: { xs: 22, md: 30 }, fontWeight: 700 }}
              >
                I am a{" "}
                <Box component="span" sx={{ color: colors.accent }}>
                  <Typewriter
                    words={content.roles}
                    loop={0}            // 0 ka matlab hamesha chalta rahe
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}      // likhne ki speed
                    deleteSpeed={40}    // delete hone ki speed
                    delaySpeed={1500}   // poora likhne ke baad rukne ka time
                  />
                </Box>
              </Typography>

            {/* Buttons */}
            <Box sx={{ mt: 4.5, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              <Button
                component="a"
                href="#projects"
                endIcon={<ArrowDownwardRounded />}
                sx={{
                  px: 3,
                  py: 1.4,
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
                View projects
              </Button>

              <Button
                component="a"
                href={resume}
                download
                startIcon={<DownloadRounded />}
                sx={{
                  px: 3,
                  py: 1.4,
                  borderRadius: "12px",
                  color: colors.text,
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  border: `1px solid ${colors.border}`,
                  "&:hover": { background: colors.hover },
                  ...focusRing,
                }}
              >
                Download CV
              </Button>
            </Box>

            {/* Social links */}
            <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 1 }}>
              {content.socials.map((item) => (
                <IconButton
                  key={item.label}
                  component="a"
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
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

          {/* Right: code card */}
          <Box
            aria-hidden
            sx={{
              width: "100%",
              minWidth: 0, // grid ke andar card ko page se bahar badhne se rokta hai
              maxWidth: { xs: "none", md: 500 },
              justifySelf: { xs: "stretch", md: "end" },
              borderRadius: { xs: "14px", sm: "18px" },
              overflow: "hidden",
              background: colors.card,
              border: `1px solid ${colors.border}`,
              boxShadow: isDark
                ? "0 24px 60px rgba(0,0,0,0.35)"
                : "0 24px 60px rgba(15,23,42,0.10)",
            }}
          >
            {/* Window bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.6, sm: 0.8 },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1.1, sm: 1.5 },
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                <Box
                  key={c}
                  sx={{
                    width: { xs: 9, sm: 10 },
                    height: { xs: 9, sm: 10 },
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: c,
                    opacity: 0.85,
                  }}
                />
              ))}
              <Typography
                noWrap
                sx={{
                  ml: { xs: 1, sm: 1.5 },
                  minWidth: 0,
                  color: colors.muted,
                  fontSize: { xs: 11.5, sm: 12 },
                  fontFamily: "'JetBrains Mono','Fira Code',ui-monospace,monospace",
                }}
              >
                developer.js
              </Typography>
            </Box>

            {/* Code */}
            <Box
              sx={{
                p: { xs: 1.75, sm: 3 },
                overflowX: "auto",
                fontFamily: "'JetBrains Mono','Fira Code',ui-monospace,monospace",
                // chhoti screen par font chhota, badi par 14px
                fontSize: "clamp(11.5px, 3.2vw, 14px)",
                lineHeight: { xs: 1.9, sm: 2 },
                // phone par lambi line neeche wrap hoti hai, tablet se upar ek line mein rehti hai
                whiteSpace: { xs: "pre-wrap", sm: "pre" },
                overflowWrap: "anywhere",
              }}
            >
              {codeLines.map((line, i) => (
                <Box
                  key={i}
                  sx={{
                    animation: `${lineIn} 420ms ease both`,
                    animationDelay: `${300 + i * 140}ms`,
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                >
                  {line.map(([text, type], j) => (
                    <Box key={j} component="span" sx={{ color: colors.code[type] }}>
                      {text}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>

            {/* Tech list */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 0.6, sm: 0.75 },
                px: { xs: 1.75, sm: 3 },
                py: { xs: 1.5, sm: 2 },
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              {profile.tech.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  sx={{
                    color: colors.muted,
                    background: colors.hover,
                    fontSize: { xs: 11.5, sm: 12 },
                    fontWeight: 500,
                    borderRadius: "8px",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}