import { useContext, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";
import {
  ApiRounded,
  ExpandMoreRounded,
  LanguageRounded,
  StorageRounded,
  WorkOutlineRounded,
  FormatQuoteRounded,
} from "@mui/icons-material";
import { Context } from "../../../context/Context.jsx";
import { getColors } from "../../getColors";

const defaults = {
  experiences: [
    {
      period: "2025 - Present",
      role: "FullStack Developer",
      company: "Independent & Freelance Projects",
      description: "Building responsive React applications, REST APIs and complete MERN stack products.",
    },
  ],
  services: [
    { title: "Frontend Development", description: "Responsive, accessible React interfaces with polished interactions." },
    { title: "MERN Stack Development", description: "Complete web applications with MongoDB, Express, React and Node.js." },
    { title: "API Development", description: "Secure and maintainable REST APIs with authentication and database integration." },
  ],
  testimonials: [],
  faqs: [
    { question: "Are you available for freelance work?", answer: "Yes. I am available for remote projects and collaborations." },
    { question: "What technologies do you use?", answer: "I mainly build with React, Material UI, Node.js, Express and MongoDB." },
  ],
};

const serviceIcons = [LanguageRounded, StorageRounded, ApiRounded];

export default function PortfolioSections({ isDark = true }) {
  const colors = getColors(isDark);
  const { portfolioSections } = useContext(Context) || {};
  const [expandedFaq, setExpandedFaq] = useState(0);
  const data = { ...defaults, ...(portfolioSections || {}) };

  return (
    <>
      {data.experiences.length > 0 && (
        <Box component="section" id="experience" sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
            <Typography component="h2" sx={{ color: colors.text, fontSize: { xs: 30, md: 40 }, fontWeight: 800, letterSpacing: "-1px" }}>
              Experience
            </Typography>
            <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: { xs: 16, md: 17 } }}>
              My practical journey through development and project work.
            </Typography>

            <Box sx={{ mt: { xs: 5, md: 6 }, display: "grid", gap: 2.5 }}>
              {data.experiences.map((item, index) => (
                <Box
                  key={`${item.period}-${item.role}-${index}`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" },
                    gap: { xs: 1.5, sm: 3 },
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: "18px",
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: colors.accent }}>
                      <WorkOutlineRounded sx={{ fontSize: 20 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{item.period}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{ color: colors.text, fontSize: 17, fontWeight: 700 }}>{item.role}</Typography>
                    <Typography sx={{ mt: 0.25, color: colors.accent, fontSize: 14, fontWeight: 600 }}>{item.company}</Typography>
                    <Typography sx={{ mt: 1, color: colors.muted, fontSize: 15, lineHeight: 1.7 }}>{item.description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {data.services.length > 0 && (
        <Box component="section" id="services" sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
            <Typography component="h2" sx={{ color: colors.text, fontSize: { xs: 30, md: 40 }, fontWeight: 800, letterSpacing: "-1px" }}>
              Services
            </Typography>
            <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: { xs: 16, md: 17 } }}>
              Ways I can help turn an idea into a reliable digital product.
            </Typography>

            <Box sx={{ mt: { xs: 5, md: 6 }, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
              {data.services.map((item, index) => {
                const Icon = serviceIcons[index % serviceIcons.length];
                return (
                  <Box key={`${item.title}-${index}`} sx={{ p: 3, borderRadius: "18px", background: colors.card, border: `1px solid ${colors.border}` }}>
                    <Box sx={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: "12px", color: colors.accent, background: colors.hover }}>
                      <Icon />
                    </Box>
                    <Typography sx={{ mt: 2.5, color: colors.text, fontSize: 18, fontWeight: 700 }}>{item.title}</Typography>
                    <Typography sx={{ mt: 1, color: colors.muted, fontSize: 15, lineHeight: 1.7 }}>{item.description}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Container>
        </Box>
      )}

      {data.testimonials.length > 0 && (
        <Box component="section" id="testimonials" sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
            <Typography component="h2" sx={{ color: colors.text, fontSize: { xs: 30, md: 40 }, fontWeight: 800, letterSpacing: "-1px" }}>Testimonials</Typography>
            <Box sx={{ mt: { xs: 5, md: 6 }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2.5 }}>
              {data.testimonials.map((item, index) => (
                <Box key={`${item.name}-${index}`} sx={{ p: 3, borderRadius: "18px", background: colors.card, border: `1px solid ${colors.border}` }}>
                  <FormatQuoteRounded sx={{ color: colors.accent, fontSize: 34 }} />
                  <Typography sx={{ mt: 1, color: colors.text, fontSize: 16, lineHeight: 1.75 }}>&quot;{item.quote}&quot;</Typography>
                  <Typography sx={{ mt: 2.5, color: colors.text, fontSize: 15, fontWeight: 700 }}>{item.name}</Typography>
                  <Typography sx={{ mt: 0.25, color: colors.muted, fontSize: 13 }}>{item.role}</Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {data.faqs.length > 0 && (
        <Box component="section" id="faq" sx={{ scrollMarginTop: 90, py: { xs: 8, md: 12 } }}>
          <Container maxWidth="md" sx={{ px: { xs: 2.5, sm: 3 } }}>
            <Typography component="h2" sx={{ textAlign: "center", color: colors.text, fontSize: { xs: 30, md: 40 }, fontWeight: 800, letterSpacing: "-1px" }}>Frequently Asked Questions</Typography>
            <Box sx={{ mt: { xs: 5, md: 6 }, display: "grid", gap: 1.5 }}>
              {data.faqs.map((item, index) => (
                <Accordion
                  key={`${item.question}-${index}`}
                  expanded={expandedFaq === index}
                  onChange={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                  disableGutters
                  elevation={0}
                  sx={{ color: colors.text, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: "14px !important", "&:before": { display: "none" } }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreRounded sx={{ color: colors.muted }} />} sx={{ px: 2.5, "& .MuiAccordionSummary-content": { my: 1.5 } }}>
                    <Typography sx={{ fontSize: 15.5, fontWeight: 700 }}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
                    <Typography sx={{ color: colors.muted, fontSize: 15, lineHeight: 1.7 }}>{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
}
