import { useContext } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { ReplyRounded, MailOutlineRounded } from "@mui/icons-material";
import { Context } from "../../../context/Context.jsx";
import { getColors } from "../../getColors";

// Returns a readable date, or "" if the message has no valid createdAt
const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

function AllMessages({ isDark = true }) {
  const colors = getColors(isDark);
  const { messages, messagesLoading, errors, refreshMessages } = useContext(Context) || {};

  // Newest first (if the messages have a createdAt date)
  const list = Array.isArray(messages)
    ? [...messages].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    : [];

  return (
    <Box component="section" aria-labelledby="all-messages-title">
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 3 }}>
        <Typography
          id="all-messages-title"
          component="h2"
          sx={{ color: colors.text, fontSize: 26, fontWeight: 800, letterSpacing: "-0.6px" }}
        >
          All Messages
        </Typography>
        <Typography sx={{ color: colors.muted, fontSize: 15 }}>({list.length})</Typography>
      </Box>

      {messagesLoading && list.length === 0 ? (
        <Box role="status" sx={{ display: "grid", justifyItems: "center", gap: 1.5, py: 8 }}>
          <CircularProgress size={30} sx={{ color: colors.accent }} />
          <Typography sx={{ color: colors.muted }}>Loading messages...</Typography>
        </Box>
      ) : errors?.messages && list.length === 0 ? (
        <Box role="alert" sx={{ display: "grid", justifyItems: "center", gap: 1.5, py: 8, textAlign: "center" }}>
          <Typography sx={{ color: colors.muted }}>{errors.messages}</Typography>
          <Button onClick={refreshMessages} variant="outlined" sx={{ color: colors.text, borderColor: colors.border, textTransform: "none" }}>
            Try again
          </Button>
        </Box>
      ) : list.length === 0 ? (
        <Box
          sx={{
            display: "grid",
            justifyItems: "center",
            gap: 1,
            py: 8,
            px: 2,
            textAlign: "center",
            borderRadius: "18px",
            color: colors.muted,
            background: colors.card,
            border: `1px dashed ${colors.border}`,
          }}
        >
          <MailOutlineRounded sx={{ fontSize: 34, color: colors.accent }} />
          <Typography sx={{ color: colors.text, fontWeight: 600 }}>No messages yet</Typography>
          <Typography sx={{ fontSize: 14 }}>
            Messages sent from your contact form will show up here.
          </Typography>
        </Box>
      ) : (
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 2 }}>
          {list.map((item) => {
            const date = formatDate(item.createdAt);
            const initial = (item.name || "?").trim().charAt(0).toUpperCase();
            const replySubject = item.subject ? `Re: ${item.subject}` : "Re: your message";

            return (
              <Box
                component="li"
                key={item._id}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: "18px",
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* Sender */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    aria-hidden
                    sx={{
                      display: "grid",
                      placeItems: "center",
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      borderRadius: "50%",
                      color: colors.accent,
                      background: colors.hover,
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    {initial}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ color: colors.text, fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>
                      {item.name}
                    </Typography>
                    <Box
                      component="a"
                      href={`mailto:${item.email}`}
                      sx={{
                        color: colors.muted,
                        fontSize: 14,
                        textDecoration: "none",
                        wordBreak: "break-all",
                        "&:hover": { color: colors.accent },
                      }}
                    >
                      {item.email}
                    </Box>
                  </Box>
                  {date && (
                    <Typography sx={{ color: colors.muted, fontSize: 13, flexShrink: 0, textAlign: "right" }}>
                      {date}
                    </Typography>
                  )}
                </Box>

                {/* Subject + message */}
                {item.subject && (
                  <Typography sx={{ mt: 2, color: colors.text, fontSize: 16, fontWeight: 600 }}>
                    {item.subject}
                  </Typography>
                )}
                <Typography
                  sx={{
                    mt: item.subject ? 0.75 : 2,
                    color: colors.muted,
                    fontSize: 15,
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {item.message}
                </Typography>

                {/* Reply */}
                <Button
                  component="a"
                  href={`mailto:${item.email}?subject=${encodeURIComponent(replySubject)}`}
                  startIcon={<ReplyRounded sx={{ fontSize: 18 }} />}
                  sx={{
                    mt: 2,
                    px: 1.75,
                    py: 0.7,
                    borderRadius: "10px",
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "none",
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    "&:hover": { background: colors.hover },
                    "&:focus-visible": { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
                  }}
                >
                  Reply
                </Button>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export default AllMessages;