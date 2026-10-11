import { useEffect, useRef, useState } from "react";
import { Box, GlobalStyles } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import { getColors } from "../../getColors";
import Certifications from "../components/Certifications";
import Footer from "../components/Footer";

// Setup: npm i gsap
gsap.registerPlugin(ScrollTrigger);

const MainPage = () => {
  // Remember the visitor's theme choice (dark by default)
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") !== "light";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      /* storage not available */
    }
  }, [isDark]);

  const colors = getColors(isDark);

  const rootRef = useRef(null); // the whole page
  const progressRef = useRef(null); // thin bar at the very top

  /* ------------------------------------------------------------------ */
  /* GSAP animations                                                      */
  /*                                                                      */
  /* 1. Reading progress bar at the top                                   */
  /* 2. Headings, text and blocks slide up when they come into view       */
  /* 3. Project / certificate cards slide up one after another            */
  /*                                                                      */
  /* Safe by design: nothing is hidden up front. An element only starts   */
  /* its animation when it is about to appear, so the page can never be   */
  /* left with empty gaps. The Hero keeps its own entrance animation.     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    // People who prefer less motion get the page with no animation at all
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const seen = new WeakSet(); // elements that already have an animation

    // Slide-up settings shared by everything
    const slideUp = { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "opacity,transform" };

    // Find new elements and give each one a scroll animation
    const setupReveals = () => {
      const root = rootRef.current;
      if (!root) return;

      // 1) Blocks inside every section (heading, text, filters, grids ...). The Hero is skipped.
      root.querySelectorAll("main > :not(#home) .MuiContainer-root > *").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);

        // A block that holds cards is not animated itself, the cards animate one by one
        if (el.querySelector("article")) return;

        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            ...slideUp,
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "top 96%", once: true },
          }
        );
      });

      // 2) Cards (projects and certificates). They can appear later, after the data loads.
      const newCards = [...root.querySelectorAll("main > :not(#home) article")].filter(
        (card) => !seen.has(card)
      );
      newCards.forEach((card) => seen.add(card));

      if (newCards.length > 0) {
        ScrollTrigger.batch(newCards, {
          start: "top 96%",
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: 36 },
              { ...slideUp, duration: 0.7, stagger: 0.1 }
            ),
        });
      }
    };

    const ctx = gsap.context(() => {
      // Reading progress bar
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
        },
      });

      setupReveals();
    }, rootRef);

    // Projects and certificates come from the server a little later.
    // When new cards appear, animate them too (and measure the page again).
    let timer;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ctx.add(setupReveals);
        ScrollTrigger.refresh();
      }, 150);
    });
    observer.observe(rootRef.current, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <Box
      ref={rootRef}
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        color: colors.text,
        transition: "background-color 200ms ease, color 200ms ease",
      }}
    >
      <GlobalStyles
        styles={{
          html: { scrollBehavior: "smooth" },
          "@media (prefers-reduced-motion: reduce)": {
            html: { scrollBehavior: "auto" },
          },
          body: { margin: 0, backgroundColor: colors.bg },
        }}
      />

      {/* Reading progress bar (grows from left to right while you scroll) */}
      <Box
        ref={progressRef}
        aria-hidden
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          zIndex: 1400,
          pointerEvents: "none",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          background: colors.accentSolid,
        }}
      />

      <Header isDark={isDark} onThemeToggle={() => setIsDark((prev) => !prev)} />

      <main>
        <Hero isDark={isDark} />
        <About isDark={isDark} />
        <Projects isDark={isDark} />
        <Skills isDark={isDark} />
        <Certifications isDark={isDark} />
        <Contact isDark={isDark} />
        <Footer isDark={isDark} />
      </main>
    </Box>
  );
};

export default MainPage;