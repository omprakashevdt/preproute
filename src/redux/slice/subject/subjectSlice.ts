import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getAllSubjects,
  type Subject,
} from "../../service/subject/Subject.service";

interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SubjectState = {
  subjects: [],
  loading: false,
  error: null,
  success: false,
};

export const fetchSubjects = createAsyncThunk(
  "subject/fetchSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSubjects();
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch subjects");
    }
  },
);

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    clearSubjectError: (state) => {
      state.error = null;
    },
    resetSubjectState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchSubjects.fulfilled,
        (state, action: PayloadAction<Subject[]>) => {
          state.loading = false;
          state.subjects = action.payload;
          state.success = true;
          state.error = null;
        },
      )
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = (action.payload as string) || "Failed to fetch subjects";
      });
  },
});

export const { clearSubjectError, resetSubjectState } = subjectSlice.actions;
export default subjectSlice.reducer;
