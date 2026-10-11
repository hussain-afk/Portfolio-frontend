import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";

/**
 * A simple carousel with no extra library.
 * - Swipe or scroll sideways (touch, trackpad, shift + wheel), cards snap into place
 * - Previous / next buttons, dots (or a counter when there are many cards)
 * - Arrow keys work when the carousel is focused
 *
 * How many cards show at once:  phone 1 (the next one peeks in),  tablet 2,  desktop 3
 *
 * Usage:
 *   <Carousel colors={colors} label="Projects">
 *     {items.map((item) => <MyCard key={item.id} ... />)}
 *   </Carousel>
 */

const GAP = 24; // space between cards in px (same as the old grid gap)
const MAX_DOTS = 10; // more pages than this: show "3 / 12" instead of dots

// Width of one slide for each screen size
const SLIDE_WIDTH = {
  xs: "86%",
  sm: "62%",
  md: `calc((100% - ${GAP}px) / 2)`,
  lg: `calc((100% - ${GAP * 2}px) / 3)`,
};

export default function Carousel({ colors, label, children }) {
  const trackRef = useRef(null);
  const [position, setPosition] = useState({ index: 0, last: 0 }); // current card, last reachable card

  const items = React.Children.toArray(children);
  const count = items.length;

  const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Distance from one card to the next
  const getStep = () => {
    const track = trackRef.current;
    const first = track?.children[0];
    if (!first) return 0;
    const second = track.children[1];
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth + GAP;
  };

  // Work out which card we are on, and how far we can go
  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = getStep();
    if (!step) {
      setPosition((prev) => (prev.index === 0 && prev.last === 0 ? prev : { index: 0, last: 0 }));
      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    const last = maxScroll <= 4 ? 0 : Math.max(1, Math.round(maxScroll / step));
    const index = Math.min(last, Math.max(0, Math.round(track.scrollLeft / step)));

    setPosition((prev) => (prev.index === index && prev.last === last ? prev : { index, last }));
  }, []);

  // Keep the numbers fresh: on scroll, on resize and when the cards change
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    let frame;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    update();

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [update, count]);

  const goTo = (target) => {
    const track = trackRef.current;
    if (!track) return;

    const { last } = position;
    const next = Math.min(last, Math.max(0, target));
    // The last stop goes all the way to the end, so the final card is never cut off
    const left = next === last ? track.scrollWidth - track.clientWidth : next * getStep();

    track.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(position.index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(position.index - 1);
    }
  };

  if (count === 0) return null;

  const { index, last } = position;
  const showControls = last > 0;
  const pages = last + 1;

  const arrowSx = {
    width: 42,
    height: 42,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    "&:hover": { background: colors.hover },
    "&.Mui-disabled": { opacity: 0.35, color: colors.muted },
    "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
  };

  return (
    <Box>
      {/* The sliding track */}
      <Box
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        sx={{
          display: "flex",
          gap: `${GAP}px`,
          // padding keeps the hover lift and shadow of the cards from being cut off
          py: 2,
          overflowX: "auto",
          overscrollBehaviorX: "contain",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 4, borderRadius: "20px" },
        }}
      >
        {items.map((item, i) => (
          <Box
            key={item.key ?? i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            sx={{
              flex: `0 0 ${SLIDE_WIDTH.xs}`,
              minWidth: 0,
              display: "flex",
              scrollSnapAlign: "start",
              "& > *": { width: "100%" },
              // only the second value is used from each breakpoint
              "@media (min-width:600px)": { flexBasis: SLIDE_WIDTH.sm },
              "@media (min-width:900px)": { flexBasis: SLIDE_WIDTH.md },
              "@media (min-width:1200px)": { flexBasis: SLIDE_WIDTH.lg },
            }}
          >
            {item}
          </Box>
        ))}
      </Box>

      {/* Controls: previous, dots (or counter), next */}
      {showControls && (
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 2.5 }}>
          <IconButton aria-label="Previous" onClick={() => goTo(index - 1)} disabled={index <= 0} sx={arrowSx}>
            <ChevronLeftRounded />
          </IconButton>

          {pages <= MAX_DOTS ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {Array.from({ length: pages }, (_, i) => {
                const active = i === index;
                return (
                  <Box
                    key={i}
                    component="button"
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={active ? "true" : undefined}
                    onClick={() => goTo(i)}
                    sx={{
                      width: active ? 24 : 8,
                      height: 8,
                      p: 0,
                      cursor: "pointer",
                      border: "none",
                      borderRadius: "999px",
                      background: active ? colors.accentSolid : colors.border,
                      transition: "width 250ms ease, background 250ms ease",
                      "&:hover": { background: active ? colors.accentSolid : colors.muted },
                      "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 3 },
                      "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                    }}
                  />
                );
              })}
            </Box>
          ) : (
            <Typography sx={{ minWidth: 56, textAlign: "center", color: colors.muted, fontSize: 14, fontWeight: 600 }}>
              {index + 1} / {pages}
            </Typography>
          )}

          <IconButton aria-label="Next" onClick={() => goTo(index + 1)} disabled={index >= last} sx={arrowSx}>
            <ChevronRightRounded />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}