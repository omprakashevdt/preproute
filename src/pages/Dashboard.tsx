import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSubjects } from "../redux/slice/subject/subjectSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import ErrorDisplay from "../components/common/ErrorDisplay";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { subjects, loading, error } = useAppSelector((state) => state.subject);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleCreateTest = () => {
    navigate("/create-test");
  };

  const handleRetry = () => {
    dispatch(fetchSubjects());
  };

  const formatDate = (dateString: string) => {
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

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay error={error} onRetry={handleRetry} />;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          List of Tests
        </Typography>
        <Button variant="contained" color="primary" onClick={handleCreateTest}>
          Create New Test
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow
                key={subject.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <TableCell component="th" scope="row">
                  {subject.name}
                </TableCell>
                <TableCell>{subject.name}</TableCell>

                <TableCell>{formatDate(subject.created_at)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" color="primary">
                      Edit
                    </Button>
                    <Button size="small" variant="outlined" color="info">
                      View
                    </Button>
                    <Button size="small" variant="outlined" color="error">
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {subjects.length === 0 && !loading && (
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
    </Box>
  );
};

export default Dashboard;
