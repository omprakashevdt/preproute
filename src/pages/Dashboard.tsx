import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAllTests } from "../redux/slice/test/testSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import ErrorDisplay from "../components/common/ErrorDisplay";
import { useDebounce } from "../hooks/useDebounce";
import CustomButton from "../components/common/CustomButton";
import { colors } from "../theme/colors";
import { toast } from "react-toastify";

interface Test {
  id: string | number;
  name: string;
  subject?: string;
  status?: "live" | "draft" | "unpublished";
  created_at?: string;
}

interface TestState {
  tests: Test[];
  loading: boolean;
  error: string | null;
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tests, loading, error } = useAppSelector(
    (state) => state.test,
  ) as TestState;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearchQuery?.trim()) {
      params.search = debouncedSearchQuery.trim();
    }
    dispatch(
      fetchAllTests(Object.keys(params).length > 0 ? params : undefined),
    );
  }, [dispatch, debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleRetry = (): void => {
    const params: Record<string, string> = {};
    if (debouncedSearchQuery?.trim()) {
      params.search = debouncedSearchQuery.trim();
    }
    dispatch(
      fetchAllTests(Object.keys(params).length > 0 ? params : undefined),
    );
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (
    status?: string,
  ): "success" | "warning" | "default" => {
    switch (status) {
      case "live":
        return "success";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay error={error} onRetry={handleRetry} />;

  return (
    <Box sx={{ overflowX: "hidden", width: "100%", maxWidth: "100vw" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={3}
        px={{ xs: 2, md: 0 }}
      >
        <Typography variant="h4" fontWeight="bold">
          List of Tests
        </Typography>
        <CustomButton
          label="Create New Test"
          type="submit"
          onClick={() => navigate("/create-test")}
          variant="contained"
          size="large"
          loading={loading}
          loadingText="Creating..."
          disabled={loading}
          sx={{
            backgroundColor: colors.primary.main,
            "&:hover": {
              backgroundColor: colors.primary.dark,
              opacity: 0.9,
            },
          }}
        />
      </Stack>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search tests by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery("")}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {isMobile ? (
        <Box sx={{ px: { xs: 2, sm: 2 }, pb: 2 }}>
          <Stack spacing={2}>
            {tests.map((test) => (
              <Card key={test.id} elevation={1} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                    mb={1}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {test.name}
                    </Typography>
                    <Chip
                      label={test.status || "unpublished"}
                      size="small"
                      variant="outlined"
                      sx={{ height: 22, fontSize: "0.7rem", flexShrink: 0 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    Subject: {test.subject || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(test.created_at)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pt: 0, justifyContent: "flex-end", gap: 1 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/create-test/${test.id}/edit`)}
                      sx={{
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2,
                          ),
                        },
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigate(`/create-test/${test.id}/publish`)
                      }
                      sx={{
                        color: theme.palette.info.main,
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.info.main, 0.2),
                        },
                      }}
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => {
                        toast.error(
                          "Delete functionality not available - API endpoint not provided",
                        );
                      }}
                      sx={{
                        color: theme.palette.error.main,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.error.main, 0.2),
                        },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            ))}
            {tests.length === 0 && (
              <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
                <Typography>No tests found.</Typography>
              </Paper>
            )}
          </Stack>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            maxHeight: "calc(100vh - 250px)",
            overflow: "auto",
            "&::-webkit-scrollbar": { width: "8px", height: "8px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#555" },
            },
          }}
        >
          <Table
            stickyHeader
            aria-label="tests table"
            sx={{ minWidth: { xs: 0, md: 1200 } }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    width: { xs: "15%", md: "15%" },
                    py: 1,
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    width: { xs: "20%", md: "20%" },
                    py: 1,
                  }}
                >
                  Subject
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    width: { xs: "15%", md: "15%" },
                    py: 1,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    width: { xs: "20%", md: "20%" },
                    py: 1,
                  }}
                >
                  Created Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    width: { xs: "15%", md: "15%" },
                    py: 1,
                    position: "sticky",
                    right: 0,
                    zIndex: 2,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.map((test) => (
                <TableRow
                  key={test.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: 500, py: 1, maxWidth: "150px" }}
                  >
                    <Box
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {test.name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>{test.subject || "N/A"}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Chip
                      label={test.status || "unpublished"}
                      size="small"
                      color={getStatusColor(test.status)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {formatDate(test.created_at)}
                  </TableCell>
                  <TableCell
                    sx={{
                      position: "sticky",
                      right: 0,
                      backgroundColor: "background.paper",
                      zIndex: 1,
                      py: 1,
                    }}
                  >
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/create-test/${test.id}/edit`)
                          }
                          sx={{
                            color: theme.palette.primary.main,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1,
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.2,
                              ),
                            },
                            borderRadius: "12px",
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/create-test/${test.id}/publish`)
                          }
                          sx={{
                            color: theme.palette.info.main,
                            backgroundColor: alpha(
                              theme.palette.info.main,
                              0.1,
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.info.main,
                                0.2,
                              ),
                            },
                            borderRadius: "12px",
                          }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => {
                            toast.error(
                              "Delete functionality not available - API endpoint not provided",
                            );
                          }}
                          sx={{
                            color: theme.palette.error.main,
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1,
                            ),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.2,
                              ),
                            },
                            borderRadius: "12px",
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {tests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      No tests found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Dashboard;
