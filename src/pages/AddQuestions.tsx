import { useState, useEffect } from "react";
import TestHeaderDetails from "../components/test/TestHeaderDetails";
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
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import TableViewIcon from "@mui/icons-material/TableView";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchTestById,
  bulkAddQuestions,
  resetTestState,
} from "../redux/slice/test/testSlice";
import { fetchTopics, fetchSubTopics } from "../redux/slice/topic/topicSlice";
import { fetchSubjects } from "../redux/slice/subject/subjectSlice";
import { colors } from "../theme/colors";
import { toast } from "react-toastify";
import CustomButton from "../components/common/CustomButton";
import RichTextEditor from "../components/common/RichTextEditor";
import Loader from "../components/common/Loader";

interface QuestionFormValues {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic_id: string;
  sub_topic_id: string;
}

const defaultValues: QuestionFormValues = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correct_option: "",
  explanation: "",
  difficulty: "medium",
  topic_id: "",
  sub_topic_id: "",
};

const AddQuestions = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    currentTest,
    loading,
    success: saveSuccess,
    error: saveError,
  } = useAppSelector((state) => state.test);

  const { topics, subTopics } = useAppSelector((state) => state.topic);
  const { subjects } = useAppSelector((state) => state.subject);

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    defaultValues,
  });

  const selectedTopicId = watch("topic_id");

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (testId) {
      dispatch(fetchTestById(testId));
    }
  }, [testId, dispatch]);

  useEffect(() => {
    if (currentTest?.subject) {

      const subjectObj = subjects.find(
        (s) => s.name === currentTest.subject || s.id === currentTest.subject,
      );

      if (subjectObj) {
        dispatch(fetchTopics(subjectObj.id));
      } else {

        dispatch(fetchSubjects());
      }
    }
  }, [currentTest, subjects, dispatch]);

  useEffect(() => {
    if (selectedTopicId) {
      dispatch(fetchSubTopics([selectedTopicId]));
    }
  }, [selectedTopicId, dispatch]);

  const handleAddQuestion = (data: QuestionFormValues) => {

    const newQuestion = {
      question: data.question,
      option1: data.option1,
      option2: data.option2,
      option3: data.option3,
      option4: data.option4,
      correct_option: data.correct_option,
      explanation: data.explanation,
      difficulty: data.difficulty,
      type: "mcq",
      test_id: testId,
      subject: currentTest?.subject,
    };

    if (isEditMode && currentQuestionIndex !== -1) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setIsEditMode(false);
      setCurrentQuestionIndex(-1);
      toast.success("Question updated locally");
    } else {
      setQuestions([...questions, newQuestion]);
      toast.success("Question added locally");
    }
    reset(defaultValues);
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    reset(question);
    setCurrentQuestionIndex(index);
    setIsEditMode(true);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    if (currentQuestionIndex === index) {
      reset(defaultValues);
      setIsEditMode(false);
      setCurrentQuestionIndex(-1);
    }
  };

  const handleSaveAll = () => {
    if (questions.length === 0) {
      toast.error("Please add at least 1 question.");
      return;
    }
    dispatch(bulkAddQuestions({ questions }));
  };

  useEffect(() => {
    if (saveSuccess) {
      toast.success("Questions saved successfully!");
      dispatch(resetTestState());

      navigate(`/create-test/${testId}/publish`);
    }
    if (saveError) {
      toast.error(saveError);
    }
  }, [saveSuccess, saveError, dispatch, navigate, testId]);

  if (loading || (testId && !currentTest)) {
    return <Loader />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      {/* Top Bar with Breadcrumbs and Publish Button */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={{ xs: 1, sm: 0 }}
        mb={2}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          mb={{ xs: 1, sm: 0 }}
        >
          Test Creation / Create Test /{" "}
          <Typography component="span" variant="body2" color="text.primary">
            {currentTest?.name || "Chapter Wise"}
          </Typography>
        </Typography>
        <CustomButton
          label="Publish"
          variant="contained"
          onClick={() => navigate(`/create-test/${testId}/publish`)}
          sx={{
            textTransform: "none",
            px: 4,
            backgroundColor: colors.primary.main,
            "&:hover": { backgroundColor: colors.primary.dark },
          }}
        />
      </Stack>

      <TestHeaderDetails
        currentTest={currentTest}
        onEdit={() => navigate(`/create-test/${testId}/edit`)}
      />

      {/* Navigation & Actions Toolbar */}
      <Box mb={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          mb={2}
        >
          <Typography variant="h6" color="primary" fontWeight="bold">
            Question{" "}
            {currentQuestionIndex !== -1
              ? currentQuestionIndex + 1
              : questions.length + 1}
            <Typography component="span" variant="h6" color="text.secondary">
              /{currentTest?.total_questions || 50}
            </Typography>
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            overflow="auto"
            flexWrap={{ xs: "wrap", sm: "nowrap" }}
          >
            <CustomButton
              label="MCQ"
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                whiteSpace: "nowrap",
                bgcolor: "#f5f5f5",
                color: "text.primary",
                border: "none",
                "&:hover": { bgcolor: "#e0e0e0", border: "none" },
              }}
              onClick={() => {
                reset(defaultValues);
                setIsEditMode(false);
                setCurrentQuestionIndex(-1);
              }}
            />
            <CustomButton
              label="Paragraph"
              variant="outlined"
              startIcon={<ArticleIcon />}
              disabled
              sx={{
                whiteSpace: "nowrap",
                bgcolor: "#fff",
                color: "text.secondary",
                border: "1px solid #e0e0e0",
              }}
            />
            <CustomButton
              label="Question Bank"
              variant="outlined"
              startIcon={<TableViewIcon />}
              disabled
              sx={{
                whiteSpace: "nowrap",
                bgcolor: "#fff",
                color: "text.secondary",
                border: "1px solid #e0e0e0",
              }}
            />
            <CustomButton
              label="CSV"
              variant="outlined"
              startIcon={<DownloadIcon />}
              disabled
              sx={{
                whiteSpace: "nowrap",
                bgcolor: "#fff",
                color: "text.secondary",
                border: "1px solid #e0e0e0",
              }}
            />
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={{ xs: 2, sm: 0 }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <CustomButton
              label="Delete All Edits"
              startIcon={<DeleteIcon />}
              sx={{ bgcolor: "#ffebee", px: 2, color: "error.main" }}
              onClick={() => reset(defaultValues)}
            />
            <CustomButton
              label="Preview"
              startIcon={<VisibilityOffIcon />}
              sx={{ color: "background.default" }}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={0}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              overflow: "hidden",
              display: { xs: "none", md: "flex" },
            }}
          >
            <CustomButton
              label="Full Question View"
              size="small"
              sx={{
                borderRadius: 0,
                color: "text.secondary",
                bgcolor: "#fff",
                px: 2,
              }}
            />
            <CustomButton
              label="Single Question List View"
              size="small"
              sx={{
                borderRadius: 0,
                color: "primary.main",
                bgcolor: "#e3f2fd",
                px: 2,
                fontWeight: "bold",
              }}
            />
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Left Sidebar - Question List */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            <Box p={2} borderBottom="1px solid #e0e0e0">
              <Typography variant="subtitle1" fontWeight="bold">
                Question creation
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Questions: {questions.length}
              </Typography>
            </Box>
            <List sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
              {questions.map((q, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    selected={currentQuestionIndex === index}
                    onClick={() => handleEditQuestion(index)}
                    sx={{
                      borderRadius: 1,
                      m: 0.5,
                      border:
                        currentQuestionIndex === index
                          ? `1px solid ${colors.primary.main}`
                          : "1px solid transparent",
                      bgcolor:
                        currentQuestionIndex === index
                          ? `${colors.primary.main}20`
                          : "transparent",
                    }}
                  >
                    <CheckCircleIcon
                      color="success"
                      sx={{ fontSize: 16, mr: 1 }}
                    />
                    <ListItemText
                      primary={`Question ${index + 1}`}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton
                  selected={!isEditMode && currentQuestionIndex === -1}
                  onClick={() => {
                    reset(defaultValues);
                    setIsEditMode(false);
                    setCurrentQuestionIndex(-1);
                  }}
                  sx={{
                    borderRadius: 1,
                    m: 0.5,
                    border:
                      !isEditMode && currentQuestionIndex === -1
                        ? `1px solid ${colors.primary.main}`
                        : "1px solid transparent",
                  }}
                >
                  <RadioButtonUncheckedIcon
                    sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                  />
                  <ListItemText
                    primary="New Question"
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "text.secondary",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Right Main Content - Form */}
        <Grid size={{ xs: 12, md: 9 }}>
          <form onSubmit={handleSubmit(handleAddQuestion)}>
            {/* Question Input */}
            <Paper
              elevation={0}
              sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <Controller
                name="question"
                control={control}
                rules={{ required: "Question text is required" }}
                render={({ field }) => (
                  <Box>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Type your question here"
                      height="120px"
                      error={!!errors.question}
                    />
                    {errors.question && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {errors.question.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Paper>

            {/* Options */}
            <Typography variant="subtitle2" mb={2}>
              Type the options below
            </Typography>
            <Controller
              name="correct_option"
              control={control}
              rules={{ required: "Please select a correct option" }}
              render={({ field: radioField }) => (
                <RadioGroup {...radioField}>
                  {["option1", "option2", "option3", "option4"].map(
                    (optKey, idx) => (
                      <Paper
                        key={optKey}
                        elevation={0}
                        sx={{
                          p: 1,
                          mb: 2,
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FormControlLabel
                          value={optKey}
                          control={<Radio />}
                          label=""
                          sx={{ mr: 0 }}
                        />
                        <Controller
                          name={optKey as any}
                          control={control}
                          rules={{ required: "Option text is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              placeholder={`Type Option ${idx + 1} here`}
                              variant="standard"
                              InputProps={{ disableUnderline: true }}
                              error={
                                !!errors[optKey as keyof QuestionFormValues]
                              }
                            />
                          )}
                        />
                        <IconButton
                          size="small"
                          onClick={() => setValue(optKey as any, "")}
                        >
                          <DeleteIcon fontSize="small" color="action" />
                        </IconButton>
                      </Paper>
                    ),
                  )}
                </RadioGroup>
              )}
            />
            {errors.correct_option && (
              <Typography color="error" variant="caption">
                {errors.correct_option.message}
              </Typography>
            )}

            {/* Solution */}
            <Typography variant="subtitle2" mt={3} mb={2}>
              Add Solution
            </Typography>
            <Paper
              elevation={0}
              sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <Controller
                name="explanation"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type solution here"
                    height="100px"
                  />
                )}
              />
            </Paper>

            {/* Settings */}
            <Typography variant="subtitle2" mb={2}>
              Question settings
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Level of Difficulty"
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="easy">Easy</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="hard">Hard</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="topic_id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Topic"
                      SelectProps={{ displayEmpty: true }}
                      disabled={!topics || topics.length === 0}
                    >
                      {topics?.map((topic) => (
                        <MenuItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="sub_topic_id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Sub Topic"
                      SelectProps={{ displayEmpty: true }}
                      disabled={!subTopics || subTopics.length === 0}
                    >
                      {subTopics?.map((subTopic) => (
                        <MenuItem key={subTopic.id} value={subTopic.id}>
                          {subTopic.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            <Box
              mt={4}
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              gap={2}
            >
              <CustomButton
                label="Exit Test Creation"
                variant="contained"
                onClick={() => navigate("/dashboard")}
                sx={{
                  backgroundColor: "#d32f2f",
                  "&:hover": { backgroundColor: "#c62828" },
                }}
              />
              <Box
                gap={2}
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
              >
                <CustomButton
                  label="Add Another Question"
                  variant="outlined"
                  onClick={handleSubmit(handleAddQuestion)}
                />
                <CustomButton
                  label="Save & Continue"
                  variant="contained"
                  onClick={handleSaveAll}
                  disabled={questions.length === 0}
                  sx={{
                    backgroundColor: colors.primary.main,
                    "&:hover": { backgroundColor: colors.primary.dark },
                  }}
                />
              </Box>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddQuestions;
