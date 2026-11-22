import { useContext, useEffect, useState } from "react";
import { Box, GlobalStyles } from "@mui/material";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import InWorkingProject from "../components/InWorkingProject";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import { getColors } from "../../getColors.js";
import Certifications from "../components/Certifications";
import Footer from "../components/Footer";
import Loader from "../../Loader.jsx";
import { Context } from "../../../context/Context.jsx";
import PortfolioSections from "../components/PortfolioSections";

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

  // `loading` is true only during the first load of projects, in-working projects and certificates
  const { loading, hero } = useContext(Context) || {};

  return (
    <Box
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
          "::selection": {
            backgroundColor: isDark ? "rgba(96,165,250,0.28)" : "rgba(37,99,235,0.18)",
          },
          "body": {
            margin: 0,
            backgroundColor: colors.bg,
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
          ".skip-link": {
            position: "fixed",
            left: 16,
            top: -80,
            zIndex: 3000,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: "10px",
            color: "#fff",
            background: colors.accentSolid,
            textDecoration: "none",
            transition: "top 150ms ease",
          },
          ".skip-link:focus": { top: 16 },
          "@media (prefers-reduced-motion: reduce)": {
            html: { scrollBehavior: "auto" },
          },
        }}
      />

      <Box component="a" href="#main-content" className="skip-link">
        Skip to main content
      </Box>

      {/* Full-screen loading screen: fades out when the data is ready */}
      <Loader loading={Boolean(loading)} isDark={isDark} />

      <Header isDark={isDark} onThemeToggle={() => setIsDark((prev) => !prev)} />

      <main id="main-content">
        <Hero isDark={isDark} data={hero} />
        <About isDark={isDark} />
        <PortfolioSections isDark={isDark} />
        <InWorkingProject isDark={isDark} />
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