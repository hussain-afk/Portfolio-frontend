import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { getColors } from "./getColors.js";
import avatar from "../assets/myProfile.png";

/**
 * Full-screen loading screen for the portfolio.
 *
 * Usage:   <Loader loading={loading} isDark={isDark} />
 *
 * - Shows while `loading` is true, then fades out and removes itself.
 * - `minDuration` (ms): it stays at least this long, so it never flashes for a split second.
 *   Use 0 if you want it to leave the moment the data is ready.
 * - Page scrolling is locked while it is visible.
 * - Respects "reduce motion" (the animations stop) and is announced to screen readers.
 */

const FADE_MS = 500; // how long the fade-out takes

/* ------------------------------------------------------------------ */
/* Animations                                                           */
/* ------------------------------------------------------------------ */

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.06); }
`;

const slide = keyframes`
  0%   { transform: translateX(-110%); }
  100% { transform: translateX(260%); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-4px); opacity: 1; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Every animation is switched off for people who prefer reduced motion
const still = { "@media (prefers-reduced-motion: reduce)": { animation: "none" } };

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function Loader({ loading = true, isDark = true, minDuration = 600 }) {
  const colors = getColors(isDark);

  const [mounted, setMounted] = useState(true); // is the screen on the page?
  const [leaving, setLeaving] = useState(false); // is it fading out?
  const [avatarFailed, setAvatarFailed] = useState(false); // photo could not load: show "H" instead
  const startedAt = useRef(Date.now());

  // Show while loading. When loading ends: wait for the minimum time, fade out, then remove.
  useEffect(() => {
    if (loading) {
      startedAt.current = Date.now();
      setMounted(true);
      setLeaving(false);
      return undefined;
    }

    const remaining = Math.max(0, minDuration - (Date.now() - startedAt.current));
    const fadeTimer = setTimeout(() => setLeaving(true), remaining);
    const removeTimer = setTimeout(() => setMounted(false), remaining + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [loading, minDuration]);

  // Do not let the page scroll behind the loader
  useEffect(() => {
    if (!mounted) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy={!leaving}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        bgcolor: colors.bg,
        color: colors.text,
        opacity: leaving ? 0 : 1,
        pointerEvents: leaving ? "none" : "auto",
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      {/* Soft glow behind the logo */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          width: { xs: 260, sm: 380 },
          height: { xs: 260, sm: 380 },
          borderRadius: "50%",
          background: colors.accentSolid,
          opacity: isDark ? 0.14 : 0.1,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          px: 3,
        }}
      >
        {/* Photo with a spinning ring around it */}
        <Box sx={{ position: "relative", width: 112, height: 112, display: "grid", placeItems: "center" }}>
          <Box
            component="svg"
            viewBox="0 0 104 104"
            aria-hidden
            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: `${spin} 1.4s linear infinite`, ...still }}
          >
            {/* grey track */}
            <circle cx="52" cy="52" r="48" fill="none" stroke={colors.border} strokeWidth="3" />
            {/* coloured arc that runs around the track */}
            <circle
              cx="52"
              cy="52"
              r="48"
              fill="none"
              stroke={colors.accent}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="90 212"
            />
          </Box>

          {/* The circle that holds the photo. overflow hidden + cover = the photo always fills it */}
          <Box
            aria-hidden
            sx={{
              display: "grid",
              placeItems: "center",
              width: 84,
              height: 84,
              overflow: "hidden",
              borderRadius: "50%", // use "24px" here for a rounded square instead
              color: "#fff",
              fontSize: 34,
              fontWeight: 800,
              background: colors.accentSolid,
              boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 12px 32px rgba(15,23,42,0.18)",
              animation: `${breathe} 2s ease-in-out infinite`,
              ...still,
            }}
          >
            {avatarFailed ? (
              "H"
            ) : (
              <Box
                component="img"
                src={avatar}
                alt=""
                draggable={false}
                decoding="async"
                onError={() => setAvatarFailed(true)}
                sx={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top", // keeps the face in view if the photo is tall
                  userSelect: "none",
                }}
              />
            )}
          </Box>
        </Box>

        {/* Name */}
        <Typography
          sx={{
            mt: 3.5,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.4px",
            animation: `${fadeUp} 600ms ease both`,
            animationDelay: "150ms",
            ...still,
          }}
        >
          MHM
          <Box component="span" sx={{ color: colors.accent }}>
            .dev
          </Box>
        </Typography>

        {/* Message with three bouncing dots */}
        <Box
          sx={{
            mt: 0.75,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: colors.muted,
            fontSize: 14,
            animation: `${fadeUp} 600ms ease both`,
            animationDelay: "300ms",
            ...still,
          }}
        >
          Loading portfolio
          <Box aria-hidden sx={{ display: "flex", gap: 0.5 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  bgcolor: colors.muted,
                  animation: `${bounce} 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 160}ms`,
                  ...still,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Thin progress bar (keeps sliding until the page is ready) */}
        <Box
          aria-hidden
          sx={{
            mt: 3,
            position: "relative",
            width: 140,
            height: 3,
            overflow: "hidden",
            borderRadius: "999px",
            bgcolor: colors.border,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "40%",
              borderRadius: "999px",
              background: colors.accentSolid,
              animation: `${slide} 1.3s ease-in-out infinite`,
              ...still,
            }}
          />
        </Box>
      </Box>

      {/* Text for screen readers only */}
      <Box
        component="span"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        {leaving ? "Portfolio loaded" : "Loading portfolio"}
      </Box>
    </Box>
  );
}