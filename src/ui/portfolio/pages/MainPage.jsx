import { useEffect, useState } from "react";
import { Box, GlobalStyles } from "@mui/material";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import { getColors } from "../../getColors";
import Certifications from "../components/Certifications";
import Footer from "../components/Footer";

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
          "@media (prefers-reduced-motion: reduce)": {
            html: { scrollBehavior: "auto" },
          },
          body: { margin: 0, backgroundColor: colors.bg },
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