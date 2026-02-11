import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";
import { toast } from "react-toastify";
import TestHeaderDetails from "../components/test/TestHeaderDetails";
import { fetchTestById, updateTestAsync } from "../redux/slice/test/testSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { UpdateTestPayload } from "../redux/service/test/Test.service";
import CustomButton from "../components/common/CustomButton";
import Loader from "../components/common/Loader";
import { colors } from "../theme/colors";

const TestPublish = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTest, loading } = useAppSelector((state) => state.test);

  const [tabValue, setTabValue] = useState(0);
  const [liveDuration, setLiveDuration] = useState("always");

  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (testId) {
      dispatch(fetchTestById(testId));
    }
  }, [dispatch, testId]);

  const handlePublish = async () => {
    if (!testId) return;

    const payload: UpdateTestPayload = {
      status: tabValue === 1 ? "scheduled" : "live",
      total_questions: currentTest?.total_questions || 0,
    };

    if (tabValue === 1) {
      payload.scheduled_date = `${publishDate}T${publishTime}`;
    }

    if (liveDuration === "custom" && endDate && endTime) {
      payload.expiry_date = `${endDate}T${endTime}`;
    }

    const result = await dispatch(updateTestAsync({ id: testId, payload }));

    if (updateTestAsync.fulfilled.match(result)) {
      toast.success("Test published successfully!");
      navigate("/dashboard");
    } else {
      toast.error(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to publish test",
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "100%", overflowX: "hidden" }}>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Test Creation /{" "}
        <Typography component="span" variant="body2" color="primary">
          Publish
        </Typography>
      </Typography>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Test created{" "}
        <Typography
          component="span"
          variant="caption"
          sx={{
            bgcolor: "#e8f5e9",
            color: "#2e7d32",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            ml: 1,
          }}
        >
          All {currentTest?.total_questions || 0} Questions done
        </Typography>
      </Typography>

      <TestHeaderDetails
        currentTest={currentTest}
        onEdit={() => navigate(`/create-test/${testId}/edit`)}
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              minWidth: { xs: "auto", sm: 120 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
          }}
        >
          <Tab label="Publish Now" />
          <Tab label="Schedule Publish" />
        </Tabs>
      </Box>

      {tabValue === 1 && (
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Select Date and Time
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Select Date"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="time"
                label="Select Time"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setPublishTime(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Live Until
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Choose how long this test should remain available on the platform.
        </Typography>

        <RadioGroup
          value={liveDuration}
          onChange={(e) => setLiveDuration(e.target.value)}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                value="always"
                control={<Radio />}
                label="Always Available"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                value="3weeks"
                control={<Radio />}
                label="3 Weeks"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                value="1week"
                control={<Radio />}
                label="1 Week"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                value="1month"
                control={<Radio />}
                label="1 Month"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                value="2weeks"
                control={<Radio />}
                label="2 Weeks"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label="Custom Duration"
              />
            </Grid>
          </Grid>
        </RadioGroup>

        {liveDuration === "custom" && (
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Select End Date"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="time"
                label="Select End Time"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Grid>
          </Grid>
        )}
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="flex-end"
        spacing={2}
        mt={4}
      >
        <CustomButton
          label="Cancel"
          variant="text"
          onClick={() => navigate(-1)}
          sx={{ color: "text.secondary" }}
        />
        <CustomButton
          label="Confirm"
          variant="contained"
          onClick={handlePublish}
          sx={{
            backgroundColor: colors.primary.main,
            "&:hover": { backgroundColor: colors.primary.dark },
          }}
        />
      </Stack>
    </Box>
  );
};

export default TestPublish;
