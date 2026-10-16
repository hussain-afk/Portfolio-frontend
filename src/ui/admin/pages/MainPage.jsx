import { useContext, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  DashboardCustomizeOutlined,
  FolderSpecialOutlined,
  ConstructionOutlined,
  WorkspacePremiumOutlined,
  MailOutlineRounded,
  OpenInNewRounded,
  ChevronRightRounded,
  TuneRounded,
} from "@mui/icons-material";
import { getColors } from "../../getColors";
import AddProject from "../components/AddProject";
import AddInWorkingProject from "../components/AddInWorkingProject";
import AddCertificate from "../components/AddCertificate";
import AllMessages from "../components/AllMessages";
import HeroSettings from "../components/HeroSettings";
import { Context } from "../../../context/Context.jsx";

// ---- Edit the dashboard here --------------------------------------------
// The tabs of the page. Add a new item here to add a new tab
// (then add its panel at the bottom of this file).
// `group` is the small title above a set of tabs in the side menu.
// The first tab is NOT automatically the default: see useState below.
const TABS = [
  {
    id: "hero",
    group: "Customize",
    label: "Hero section",
    icon: TuneRounded,
    title: "Customize hero section",
    subtitle: "Change your headline, intro and availability badge.",
  },
  {
    id: "messages",
    group: "Inbox",
    label: "Messages",
    icon: MailOutlineRounded,
    title: "Messages",
    subtitle: "Read what visitors sent you from your contact form.",
  },
  {
    id: "project",
    group: "Create",
    label: "Add project",
    icon: FolderSpecialOutlined,
    title: "Add project",
    subtitle: "Show your best finished work on your portfolio.",
  },
  {
    id: "inworking",
    group: "Create",
    label: "In-working project",
    icon: ConstructionOutlined,
    title: "Add in-working project",
    subtitle: "Share a project you are still building.",
  },
  {
    id: "certificate",
    group: "Create",
    label: "Add certificate",
    icon: WorkspacePremiumOutlined,
    title: "Add certificate",
    subtitle: "Add a course or credential you completed.",
  },
];

const PORTFOLIO_URL = "/"; // where the "View portfolio" button goes
// -------------------------------------------------------------------------

// One menu button. `vertical` = in the side menu (desktop), otherwise a pill in the top bar (mobile)
function TabButton({ tab, active, vertical, colors, onSelect }) {
  const Icon = tab.icon;

  return (
    <Box
      component="button"
      type="button"
      role="tab"
      id={vertical ? undefined : `tab-${tab.id}`}
      aria-selected={active}
      aria-controls={`panel-${tab.id}`}
      onClick={() => onSelect(tab.id)}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        gap: 1.25,
        width: vertical ? "100%" : "auto",
        px: vertical ? 1.5 : { xs: 1.5, sm: 2.25 },
        py: vertical ? 1.15 : 1,
        cursor: "pointer",
        border: "none",
        borderRadius: "10px",
        fontFamily: "inherit",
        fontSize: 14,
        fontWeight: 600,
        textAlign: "left",
        whiteSpace: "nowrap",
        color: vertical ? (active ? colors.text : colors.muted) : active ? "#fff" : colors.muted,
        background: vertical
          ? active
            ? colors.hover
            : "transparent"
          : active
          ? colors.accentSolid
          : "transparent",
        transition: "background 200ms ease, color 200ms ease",
        "&:hover": {
          color: vertical || active ? (vertical ? colors.text : "#fff") : colors.text,
          background: vertical ? colors.hover : active ? colors.accentSolid : "transparent",
        },
        "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
        // little accent bar on the left of the active side menu item
        "&::before": vertical
          ? {
              content: '""',
              position: "absolute",
              left: 0,
              top: "22%",
              bottom: "22%",
              width: 3,
              borderRadius: "0 3px 3px 0",
              background: colors.accentSolid,
              opacity: active ? 1 : 0,
              transition: "opacity 200ms ease",
            }
          : undefined,
      }}
    >
      <Icon sx={{ fontSize: 20, color: vertical && active ? colors.accent : "inherit" }} />
      {tab.label}
    </Box>
  );
}

export default function AddContent({ isDark = true }) {
  const colors = getColors(isDark);
  const { hero } = useContext(Context) || {};
  const [tab, setTab] = useState("messages"); // tab shown first

  const current = TABS.find((item) => item.id === tab) || TABS[0];
  const groups = [...new Set(TABS.map((item) => item.group))];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.bg }}>
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 2.5, sm: 3, lg: 4 },
          py: { xs: 3, md: 5 },
          display: "grid",
          gap: { xs: 0, lg: 4 },
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "264px minmax(0, 1fr)" },
          alignItems: "start",
        }}
      >
        {/* ================= Side menu (desktop only) ================= */}
        <Box
          component="aside"
          sx={{
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            position: "sticky",
            top: 32,
            p: 2,
            borderRadius: "18px",
            background: colors.card,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 0.5, pb: 2.5 }}>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: "12px",
                color: "#fff",
                background: colors.accentSolid,
              }}
            >
              <DashboardCustomizeOutlined />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ color: colors.text, fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>
                Dashboard
              </Typography>
              <Typography sx={{ color: colors.muted, fontSize: 12.5 }}>Content manager</Typography>
            </Box>
          </Box>

          {/* Menu, grouped */}
          <Box
            role="tablist"
            aria-label="Choose a section"
            aria-orientation="vertical"
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            {groups.map((group) => (
              <Box key={group}>
                <Typography
                  sx={{
                    px: 1.5,
                    pb: 0.75,
                    color: colors.muted,
                    fontSize: 11.5,
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                  }}
                >
                  {group}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {TABS.filter((item) => item.group === group).map((item) => (
                    <TabButton
                      key={item.id}
                      tab={item}
                      active={tab === item.id}
                      vertical
                      colors={colors}
                      onSelect={setTab}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ================= Main area ================= */}
        <Box component="main" sx={{ minWidth: 0 }}>
          {/* Page header */}
          <Box
            component="header"
            sx={{
              mb: { xs: 3, md: 4 },
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              {/* Breadcrumb: Dashboard > Messages */}
              <Box
                aria-label="Breadcrumb"
                sx={{ mb: 0.75, display: "flex", alignItems: "center", gap: 0.5, color: colors.muted, fontSize: 13 }}
              >
                <span>Dashboard</span>
                <ChevronRightRounded sx={{ fontSize: 16 }} />
                <Box component="span" sx={{ color: colors.text, fontWeight: 600 }}>
                  {current.label}
                </Box>
              </Box>

              <Typography
                component="h1"
                sx={{
                  color: colors.text,
                  fontSize: { xs: 26, md: 32 },
                  fontWeight: 800,
                  letterSpacing: "-0.8px",
                  lineHeight: 1.15,
                }}
              >
                {current.title}
              </Typography>
              <Typography sx={{ mt: 0.75, color: colors.muted, fontSize: 14.5 }}>
                {current.subtitle}
              </Typography>
            </Box>

            <Button
              component="a"
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewRounded sx={{ fontSize: 17 }} />}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "12px",
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                color: colors.text,
                background: colors.card,
                border: `1px solid ${colors.border}`,
                "&:hover": { background: colors.hover },
                "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
              }}
            >
              View portfolio
            </Button>
          </Box>

          {/* Top tab bar (phone and tablet only; desktop uses the side menu) */}
          <Box
            role="tablist"
            aria-label="Choose a section"
            sx={{
              display: { xs: "inline-flex", lg: "none" },
              maxWidth: "100%",
              overflowX: "auto",
              mb: 3,
              p: 0.5,
              borderRadius: "14px",
              background: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            {TABS.map((item) => (
              <TabButton
                key={item.id}
                tab={item}
                active={tab === item.id}
                vertical={false}
                colors={colors}
                onSelect={setTab}
              />
            ))}
          </Box>

          {/* ================= Panels =================
              All panels stay on the page (only hidden), so what you typed
              in a form is not lost when you switch tabs. */}
          <Box
            role="tabpanel"
            id="panel-hero"
            aria-labelledby="tab-hero"
            sx={{ display: tab === "hero" ? "block" : "none" }}
          >
            <HeroSettings key={hero?._id || "hero-default"} isDark={isDark} />
          </Box>

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
            id="panel-inworking"
            aria-labelledby="tab-inworking"
            sx={{ display: tab === "inworking" ? "block" : "none" }}
          >
            <AddInWorkingProject isDark={isDark} />
          </Box>

          <Box
            role="tabpanel"
            id="panel-certificate"
            aria-labelledby="tab-certificate"
            sx={{ display: tab === "certificate" ? "block" : "none" }}
          >
            <AddCertificate isDark={isDark} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}