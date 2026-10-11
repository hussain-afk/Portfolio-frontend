import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  DashboardCustomizeOutlined,
  FolderSpecialOutlined,
  WorkspacePremiumOutlined,
  MailOutlineRounded,
} from "@mui/icons-material";
import { getColors } from "../../getColors";
import AddProject from "../components/AddProject";
import AddCertificate from "../components/AddCertificate";
import AllMessages from "../components/AllMessages";

// The tabs of the page. Add a new item here to add a new tab.
// The first tab is NOT automatically the default: see useState below.
const TABS = [
  { id: "messages", label: "Messages", icon: MailOutlineRounded },
  { id: "project", label: "Add project", icon: FolderSpecialOutlined },
  { id: "certificate", label: "Add certificate", icon: WorkspacePremiumOutlined },
];

export default function AddContent({ isDark = true }) {
  const colors = getColors(isDark);
  const [tab, setTab] = useState("messages"); // tab shown first

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.bg, py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3 } }}>
        {/* ================= Page header ================= */}
        <Box
          component="header"
          sx={{
            mb: 4,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 52,
                height: 52,
                flexShrink: 0,
                borderRadius: "14px",
                color: "#fff",
                background: colors.accentSolid,
              }}
            >
              <DashboardCustomizeOutlined />
            </Box>
            <Box>
              <Typography
                component="h1"
                sx={{
                  color: colors.text,
                  fontSize: { xs: 24, md: 30 },
                  fontWeight: 800,
                  letterSpacing: "-0.8px",
                  lineHeight: 1.15,
                }}
              >
                Content manager
              </Typography>
              <Typography sx={{ mt: 0.5, color: colors.muted, fontSize: 14.5 }}>
                Read messages and add projects and certificates to your portfolio.
              </Typography>
            </Box>
          </Box>

          {/* Tab switcher */}
          <Box
            role="tablist"
            aria-label="Choose a section"
            sx={{
              display: "inline-flex",
              maxWidth: "100%",
              overflowX: "auto",
              p: 0.5,
              borderRadius: "14px",
              background: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <Box
                  key={id}
                  component="button"
                  type="button"
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={active}
                  aria-controls={`panel-${id}`}
                  onClick={() => setTab(id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    gap: 1,
                    px: { xs: 1.5, sm: 2.25 },
                    py: 1,
                    cursor: "pointer",
                    border: "none",
                    borderRadius: "10px",
                    fontFamily: "inherit",
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    color: active ? "#fff" : colors.muted,
                    background: active ? colors.accentSolid : "transparent",
                    transition: "background 200ms ease, color 200ms ease",
                    "&:hover": { color: active ? "#fff" : colors.text },
                    "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
                  }}
                >
                  <Icon sx={{ fontSize: 19 }} />
                  {label}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ================= Panels =================
            All panels stay on the page (only hidden), so what you typed
            in a form is not lost when you switch tabs. */}
        <Box
          role="tabpanel"
          id="panel-messages"
          aria-labelledby="tab-messages"
          sx={{ display: tab === "messages" ? "block" : "none" }}
        >
          <AllMessages isDark={isDark} />
        </Box>

        <Box
          role="tabpanel"
          id="panel-project"
          aria-labelledby="tab-project"
          sx={{ display: tab === "project" ? "block" : "none" }}
        >
          <AddProject isDark={isDark} />
        </Box>

        <Box
          role="tabpanel"
          id="panel-certificate"
          aria-labelledby="tab-certificate"
          sx={{ display: tab === "certificate" ? "block" : "none" }}
        >
          <AddCertificate isDark={isDark} />
        </Box>
      </Container>
    </Box>
  );
}