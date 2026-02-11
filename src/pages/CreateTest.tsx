import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Stack,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSubjects } from "../redux/slice/subject/subjectSlice";
import {
  fetchTopics,
  fetchSubTopics,
  clearSubTopics,
} from "../redux/slice/topic/topicSlice";
import type { Topic, SubTopic } from "../redux/service/topic/Topic.service";
import {
  createNewTest,
  resetTestState,
  fetchTestById,
  updateTestAsync,
} from "../redux/slice/test/testSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../components/common/CustomButton";
import Loader from "../components/common/Loader";
import { colors } from "../theme/colors";

type FormValues = {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number | string;
  wrong_marks: number | string;
  unattempt_marks: number | string;
  difficulty: "easy" | "medium" | "hard" | "";
  total_time: number | string;
  no_of_questions: number | string;
  total_marks: number | string;
};

const CreateTest: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { testId } = useParams<{ testId?: string }>();
  const isEditMode = Boolean(testId);

  const { subjects, loading: subjectsLoading } = useAppSelector(
    (state) => state.subject,
  );
  const {
    loading: testLoading,
    success,
    error,
    createdTestId,
    currentTest,
  } = useAppSelector((state) => state.test);
  const { topics, subTopics, loadingTopics, loadingSubTopics } = useAppSelector(
    (state) => state.topic,
  );

  const [submissionType, setSubmissionType] = useState<"draft" | "publish">(
    "publish",
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      type: "chapter_wise",
      subject: "",
      topics: [],
      sub_topics: [],
      correct_marks: "",
      wrong_marks: "",
      unattempt_marks: "",
      difficulty: "",
      total_time: "",
      no_of_questions: "",
      total_marks: "",
    },
  });

  const selectedSubject = watch("subject");
  const selectedTopics = watch("topics");

  const [formSubmitted, setFormSubmitted] = useState(false);
  const isPopulating = useRef(false);

  useEffect(() => {
    if (!isEditMode) {
      dispatch(resetTestState());
    }
    dispatch(fetchSubjects());
    setFormSubmitted(false);
  }, [dispatch, isEditMode]);

  useEffect(() => {
    if (isEditMode && testId) {
      dispatch(fetchTestById(testId));
    }
  }, [dispatch, isEditMode, testId]);

  useEffect(() => {
    if (isEditMode && currentTest && subjects.length > 0) {
      isPopulating.current = true;
      const subjectObj = subjects.find(
        (s) => s.name === currentTest.subject || s.id === currentTest.subject,
      );
      const subjectId = subjectObj?.id || currentTest.subject;

      setValue("name", currentTest.name || "");
      setValue(
        "type",
        currentTest.type === "chapterwise" ? "chapter_wise" : currentTest.type,
      );
      setValue("subject", subjectId);
      setValue("correct_marks", currentTest.correct_marks || "");
      setValue("wrong_marks", currentTest.wrong_marks || "");
      setValue("unattempt_marks", currentTest.unattempt_marks || "");
      setValue("difficulty", currentTest.difficulty || "");
      setValue("total_time", currentTest.total_time || "");
      setValue("no_of_questions", currentTest.total_questions || "");
      setValue("total_marks", currentTest.total_marks || "");

      if (subjectId) {
        dispatch(fetchTopics(subjectId)).then((action) => {
          if (
            action.payload &&
            currentTest.topics &&
            Array.isArray(currentTest.topics)
          ) {
            const fetchedTopics = action.payload as Topic[];
            const topicIds = currentTest.topics
              .map((topicName: string) => {
                const found = fetchedTopics.find((t) => t.name === topicName);
                return found?.id;
              })
              .filter(
                (id: string | undefined): id is string => id !== undefined,
              );

            setValue("topics", topicIds);

            if (topicIds.length > 0) {
              dispatch(fetchSubTopics(topicIds)).then((subAction) => {
                if (
                  subAction.payload &&
                  currentTest.sub_topics &&
                  Array.isArray(currentTest.sub_topics)
                ) {
                  const fetchedSubTopics = subAction.payload as SubTopic[];
                  const subTopicIds = currentTest.sub_topics
                    .map((subTopicName: string) => {
                      const found = fetchedSubTopics.find(
                        (st) => st.name === subTopicName,
                      );
                      return found?.id;
                    })
                    .filter(
                      (id: string | undefined): id is string =>
                        id !== undefined,
                    );

                  setValue("sub_topics", subTopicIds);
                }
                isPopulating.current = false;
              });
            } else {
              isPopulating.current = false;
            }
          } else {
            isPopulating.current = false;
          }
        });
      } else {
        isPopulating.current = false;
      }
    }
  }, [isEditMode, currentTest, subjects, setValue, dispatch]);

  useEffect(() => {
    if (selectedSubject && !isEditMode) {
      dispatch(fetchTopics(selectedSubject));
      setValue("topics", []);
      setValue("sub_topics", []);
      dispatch(clearSubTopics());
    }
  }, [selectedSubject, dispatch, setValue, isEditMode]);

  useEffect(() => {
    if (isPopulating.current) return;
    if (selectedTopics && selectedTopics.length > 0) {
      dispatch(fetchSubTopics(selectedTopics));
      setValue("sub_topics", []);
    } else {
      dispatch(clearSubTopics());
      setValue("sub_topics", []);
    }
  }, [selectedTopics, dispatch, setValue]);

  useEffect(() => {
    if (!formSubmitted) {
      return;
    }

    if (success && (createdTestId || isEditMode)) {
      if (isEditMode && testId) {
        toast.success("Test updated successfully!");
        setTimeout(() => {
          navigate(`/create-test/${testId}/publish`);
          dispatch(resetTestState());
          setFormSubmitted(false);
        }, 1000);
      } else if (createdTestId) {
        const message =
          submissionType === "draft"
            ? "Test draft saved!"
            : "Test created successfully!";
        toast.success(message);

        setTimeout(() => {
          if (submissionType === "draft") {
            navigate("/dashboard");
          } else {
            navigate(`/create-test/${createdTestId}/questions`);
          }
          dispatch(resetTestState());
          setFormSubmitted(false);
        }, 1000);
      }
    }

    if (error) {
      toast.error(error);
      setFormSubmitted(false);
    }
  }, [
    success,
    error,
    dispatch,
    navigate,
    createdTestId,
    formSubmitted,
    submissionType,
    isEditMode,
    testId,
  ]);

  const onSubmit = (data: FormValues) => {
    const { no_of_questions, type, ...restData } = data;

    const typeMapping: Record<string, string> = {
      chapter_wise: "chapterwise",
    };

    const apiPayload = {
      ...restData,
      type: typeMapping[type] || type,
      sub_topics: data.sub_topics || [],
      total_questions: Number(no_of_questions),
      total_marks: Number(data.total_marks),
      correct_marks: Number(data.correct_marks),
      wrong_marks: Number(data.wrong_marks),
      unattempt_marks: Number(data.unattempt_marks),
      total_time: Number(data.total_time),
      difficulty: data.difficulty as "easy" | "medium" | "hard",
      status: submissionType === "draft" ? "draft" : "unpublished",
    };

    setFormSubmitted(true);

    if (isEditMode && testId) {
      dispatch(updateTestAsync({ id: testId, payload: apiPayload }));
    } else {
      dispatch(createNewTest(apiPayload));
    }
  };

  if ((subjectsLoading && subjects.length === 0) || testLoading) {
    return <Loader />;
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Create Test / Chapter Wise
      </Typography>

      <Paper
        sx={{ mb: 3, borderRadius: 3, p: 1, border: "1px solid #E0E0E0" }}
        elevation={0}
      >
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            width: { xs: "100%", md: "50%" },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              color: "text.secondary",
              minWidth: { xs: "auto", sm: 120 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
          }}
        >
          <Tab label="Chapter Wise" disableRipple />
          <Tab label="PYQ" disableRipple />
          <Tab label="Mock Test" disableRipple />
          <Tab label="Daily Challenge" disableRipple />
          <Tab label="Uncategorised" disableRipple />
        </Tabs>
      </Paper>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: 4, borderRadius: 3 }} elevation={0}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" mb={1} fontWeight={600}>
                Subject
              </Typography>
              <Controller
                name="subject"
                control={control}
                rules={{ required: "Subject is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    placeholder="Choose from Drop-down"
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                    SelectProps={{ displayEmpty: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem disabled value="">
                      <Typography color="text.secondary">
                        Choose from Drop-down
                      </Typography>
                    </MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" mb={1} fontWeight={600}>
                Name of Test
              </Typography>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Test name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Enter name of Test"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Topic
                </Typography>
                {loadingTopics && <CircularProgress size={16} />}
              </Stack>
              <Controller
                name="topics"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    disabled={!selectedSubject || loadingTopics}
                    SelectProps={{
                      multiple: true,
                      displayEmpty: true,
                      value: field.value || [],
                      renderValue: (selected) => {
                        if ((selected as string[]).length === 0) {
                          return (
                            <Typography color="text.secondary">
                              Choose from Drop-down
                            </Typography>
                          );
                        }
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {(selected as string[]).map((value) => {
                              const foundTopic = topics.find(
                                (t) => t.id === value,
                              );
                              return (
                                <Chip
                                  key={value}
                                  label={foundTopic?.name || value}
                                  size="small"
                                />
                              );
                            })}
                          </Box>
                        );
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem disabled value="">
                      <Typography color="text.secondary">
                        Choose from Drop-down
                      </Typography>
                    </MenuItem>
                    {topics.map((topic) => (
                      <MenuItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </MenuItem>
                    ))}
                    {topics.length === 0 &&
                      !loadingTopics &&
                      selectedSubject && (
                        <MenuItem disabled>
                          <Typography variant="caption" color="text.secondary">
                            No topics found
                          </Typography>
                        </MenuItem>
                      )}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Sub Topic
                </Typography>
                {loadingSubTopics && <CircularProgress size={16} />}
              </Stack>
              <Controller
                name="sub_topics"
                control={control}
                rules={{
                  validate: (value) =>
                    (value && value.length > 0) || "Sub-topics are required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    error={!!errors.sub_topics}
                    helperText={errors.sub_topics?.message as string}
                    disabled={
                      !selectedTopics ||
                      selectedTopics.length === 0 ||
                      loadingSubTopics
                    }
                    SelectProps={{
                      multiple: true,
                      displayEmpty: true,
                      value: field.value || [],
                      renderValue: (selected) => {
                        if ((selected as string[]).length === 0) {
                          return (
                            <Typography color="text.secondary">
                              Choose from Drop-down
                            </Typography>
                          );
                        }
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {(selected as string[]).map((value) => {
                              const foundSubTopic = subTopics.find(
                                (t) => t.id === value,
                              );
                              return (
                                <Chip
                                  key={value}
                                  label={foundSubTopic?.name || value}
                                  size="small"
                                />
                              );
                            })}
                          </Box>
                        );
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem disabled value="">
                      <Typography color="text.secondary">
                        Choose from Drop-down
                      </Typography>
                    </MenuItem>
                    {subTopics.map((subTopic) => (
                      <MenuItem key={subTopic.id} value={subTopic.id}>
                        {subTopic.name}
                      </MenuItem>
                    ))}
                    {subTopics.length === 0 &&
                      !loadingSubTopics &&
                      selectedTopics &&
                      selectedTopics.length > 0 && (
                        <MenuItem disabled>
                          <Typography variant="caption" color="text.secondary">
                            No sub-topics found
                          </Typography>
                        </MenuItem>
                      )}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" mb={1} fontWeight={600}>
                Duration (Minutes)
              </Typography>
              <Controller
                name="total_time"
                control={control}
                rules={{ required: "Duration is required", min: 1 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="text"
                    inputMode="numeric"
                    fullWidth
                    placeholder="Enter the time"
                    error={!!errors.total_time}
                    helperText={errors.total_time?.message}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) {
                        field.onChange(val);
                      }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" mb={1} fontWeight={600}>
                Test Difficulty Level
              </Typography>
              <Controller
                name="difficulty"
                control={control}
                rules={{ required: "Difficulty is required" }}
                render={({ field }) => (
                  <FormControl component="fieldset" error={!!errors.difficulty}>
                    <RadioGroup
                      row
                      {...field}
                      sx={{ gap: 2, height: "56px", alignItems: "center" }}
                    >
                      <FormControlLabel
                        value="easy"
                        control={<Radio />}
                        label="Easy"
                      />
                      <FormControlLabel
                        value="medium"
                        control={<Radio />}
                        label="Medium"
                      />
                      <FormControlLabel
                        value="hard"
                        control={<Radio />}
                        label="Difficult"
                      />
                    </RadioGroup>
                    <FormHelperText>
                      {errors.difficulty?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" mb={2} fontWeight={600}>
                Marking Scheme:
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    display="block"
                    mb={1}
                    color="text.secondary"
                  >
                    Wrong Answer
                  </Typography>
                  <Controller
                    name="wrong_marks"
                    control={control}
                    rules={{
                      required: "Wrong marks are required",
                      validate: (value) => {
                        const numValue = Number(value);
                        if (isNaN(numValue)) {
                          return "Please enter a valid number";
                        }
                        if (numValue >= 0) {
                          return "Wrong marks must be negative";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        inputMode="numeric"
                        fullWidth
                        placeholder="Ex: -1"
                        error={!!errors.wrong_marks}
                        helperText={errors.wrong_marks?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          
                          if (
                            val === "" ||
                            val === "-" ||
                            /^-\d*\.?\d*$/.test(val)
                          ) {
                            field.onChange(val);
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    display="block"
                    mb={1}
                    color="text.secondary"
                  >
                    Unattempted
                  </Typography>
                  <Controller
                    name="unattempt_marks"
                    control={control}
                    rules={{ required: "Unattempted marks are required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        inputMode="numeric"
                        fullWidth
                        placeholder="Ex: 0"
                        error={!!errors.unattempt_marks}
                        helperText={errors.unattempt_marks?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[-]?\d*\.?\d*$/.test(val)) {
                            field.onChange(val);
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    display="block"
                    mb={1}
                    color="text.secondary"
                  >
                    Correct Answer
                  </Typography>
                  <Controller
                    name="correct_marks"
                    control={control}
                    rules={{ required: "Correct marks are required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        inputMode="numeric"
                        fullWidth
                        placeholder="Ex: 4"
                        error={!!errors.correct_marks}
                        helperText={errors.correct_marks?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[-]?\d*\.?\d*$/.test(val)) {
                            field.onChange(val);
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* No of Questions */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    display="block"
                    mb={1}
                    color="text.secondary"
                  >
                    No of Questions
                  </Typography>
                  <Controller
                    name="no_of_questions"
                    control={control}
                    rules={{ required: "Total questions are required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        inputMode="numeric"
                        fullWidth
                        placeholder="Ex: 250"
                        error={!!errors.no_of_questions}
                        helperText={errors.no_of_questions?.message}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) {
                            field.onChange(val);
                          }
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Total Marks */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    display="block"
                    mb={1}
                    color="text.secondary"
                  >
                    Total Marks
                  </Typography>
                  <Controller
                    name="total_marks"
                    control={control}
                    rules={{ required: "Total marks are required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        inputMode="numeric"
                        fullWidth
                        placeholder="Ex: 250"
                        error={!!errors.total_marks}
                        helperText={errors.total_marks?.message}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*\.?\d*$/.test(val)) {
                            field.onChange(val);
                          }
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* buttons */}
            <Grid
              size={{ xs: 12 }}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              mt={2}
              gap={2}
            >
              {/* Cancel */}
              <CustomButton
                variant="text"
                label="Cancel"
                onClick={() => navigate("/dashboard")}
                sx={{
                  width: 160,
                  color: colors.primary.main,
                  backgroundColor: colors.background.default,
                }}
              />

              {/* Save as Draft */}
              <CustomButton
                variant="outlined"
                label="Save as Draft"
                loading={testLoading && submissionType === "draft"}
                loadingText="Saving..."
                onClick={() => {
                  setSubmissionType("draft");
                  handleSubmit(onSubmit)();
                }}
                sx={{
                  width: 160,
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                  "&:hover": {
                    borderColor: colors.primary.dark,
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              />

              {/* Next */}
              <CustomButton
                sx={{
                  width: 160,
                  backgroundColor: colors.primary.main,
                  "&:hover": {
                    backgroundColor: colors.primary.dark,
                    opacity: 0.9,
                  },
                }}
                variant="contained"
                label="Next"
                loading={testLoading && submissionType === "publish"}
                loadingText="Processing..."
                onClick={() => {
                  setSubmissionType("publish");
                  handleSubmit(onSubmit)();
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </form>
    </Box>
  );
};

export default CreateTest;
