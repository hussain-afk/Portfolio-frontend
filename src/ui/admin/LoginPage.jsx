import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { getColors } from "../getColors";
import useAdmin from '../../hooks/useAdmin'

export default function Login({ isDark = true }) {
  const colors = getColors(isDark);

  const { handleAdminLogin } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your login logic here (email and password are in state)
    try {
        const response = await handleAdminLogin(email, password);
        // console.log('Login successful:', response);
        // You can redirect the user or update the UI based on the response
    } catch (error) {
        console.error('Login failed:', error);
    }
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
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2.5,
        py: 6,
        bgcolor: colors.bg,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: "18px",
          background: colors.card,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Typography
          component="h1"
          sx={{ color: colors.text, fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px" }}
        >
          Admin login
        </Typography>
        <Typography sx={{ mt: 1, color: colors.muted, fontSize: 15 }}>
          Sign in to manage your portfolio.
        </Typography>

        <Box sx={{ mt: 3.5, display: "grid", gap: 2.25 }}>
          <TextField
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={fieldSx}
          />

          <TextField
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={fieldSx}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 0.5,
              py: 1.4,
              borderRadius: "12px",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              background: colors.accentSolid,
              boxShadow: "none",
              "&:hover": { background: colors.accentSolidHover, boxShadow: "none" },
              "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
            }}
          >
            Sign in
          </Button>
        </Box>
      </Box>
    </Box>
  );
}