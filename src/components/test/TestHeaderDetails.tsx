import {
  Box,
  Typography,
  Grid,
  Stack,
  Chip,
  Switch,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Test } from "../../redux/service/test/Test.service";

interface TestHeaderDetailsProps {
  currentTest: Test | null;
  onEdit?: () => void;
}

const TestHeaderDetails = ({ currentTest, onEdit }: TestHeaderDetailsProps) => {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0", borderRadius: 3 }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Chip
          label={currentTest?.type || "Chapter Wise"}
          sx={{
            bgcolor: "#1a237e",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "capitalize",
            borderRadius: 1,
          }}
        />
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Hide from Moderator
          </Typography>
          <Switch color="success" />
          <IconButton size="small" onClick={onEdit}>
            <EditIcon color="primary" />
          </IconButton>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png"
            alt="icon"
            sx={{ width: 28, height: 28 }}
          />
          <Typography variant="h5" fontWeight="bold">
            {currentTest?.name || "Chapter 1"}
          </Typography>
        </Stack>
        <Chip
          icon={<CheckCircleIcon sx={{ "&&": { color: "#fff" } }} />}
          label={currentTest?.difficulty || "Easy"}
          sx={{
            bgcolor:
              currentTest?.difficulty === "hard"
                ? "error.main"
                : currentTest?.difficulty === "medium"
                  ? "warning.main"
                  : "#2e7d32",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "capitalize",
            borderRadius: 1,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Stack>

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 80 }}
              >
                Subject :
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                {currentTest?.subject || "N/A"}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 80 }}
              >
                Topic :
              </Typography>
              <Stack direction="row" spacing={1}>
                {currentTest?.topics?.length ? (
                  currentTest.topics.map((t, i) => (
                    <Chip
                      key={i}
                      label={
                        typeof t === "string"
                          ? t
                          : (t as { name: string })?.name || "Topic"
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#ff9800",
                        color: "#ed6c02",
                        bgcolor: "#fff3e0",
                        fontWeight: 500,
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2">-</Typography>
                )}
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 80 }}
              >
                Sub Topic :
              </Typography>
              <Stack direction="row" spacing={1}>
                {currentTest?.sub_topics?.length ? (
                  currentTest.sub_topics.map((t, i) => (
                    <Chip
                      key={i}
                      label={
                        typeof t === "string"
                          ? t
                          : (t as { name: string })?.name || "SubTopic"
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#ff9800",
                        color: "#ed6c02",
                        bgcolor: "#fff3e0",
                        fontWeight: 500,
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2">-</Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid
          size={{ xs: 12, md: 4 }}
          display="flex"
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
        >
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "#fff",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight="bold">
                {currentTest?.total_time || 0} Min
              </Typography>
            </Stack>
            <Divider orientation="vertical" flexItem variant="middle" />
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <HelpOutlineIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight="bold">
                {currentTest?.total_questions || 0} Q's
              </Typography>
            </Stack>
            <Divider orientation="vertical" flexItem variant="middle" />
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <BarChartIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight="bold">
                {currentTest?.total_marks || 0} Marks
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TestHeaderDetails;
