import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTest,
  getAllTests,
  getTestById,
  bulkCreateQuestions,
  updateTest,
  type CreateTestPayload,
  type BulkCreateQuestionsPayload,
  type UpdateTestPayload,
  type GetAllTestsParams,
  type Test,
} from "../../service/test/Test.service";

interface TestState {
  loading: boolean;
  error: string | null;
  success: boolean;
  testCreated: boolean;
  createdTestId: string | null;
  currentTest: Test | null;
  tests: Test[];
}

const initialState: TestState = {
  loading: false,
  error: null,
  success: false,
  testCreated: false,
  createdTestId: null,
  currentTest: null,
  tests: [],
};

export const createNewTest = createAsyncThunk(
  "test/createTest",
  async (payload: CreateTestPayload, { rejectWithValue }) => {
    try {
      const response = await createTest(payload);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to create test");
    }
  },
);

export const fetchAllTests = createAsyncThunk(
  "test/fetchAllTests",
  async (params: GetAllTestsParams | undefined, { rejectWithValue }) => {
    try {
      const response = await getAllTests(params);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch tests");
    }
  },
);

export const fetchTestById = createAsyncThunk(
  "test/fetchTestById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getTestById(id);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch test");
    }
  },
);

export const bulkAddQuestions = createAsyncThunk(
  "test/bulkAddQuestions",
  async (payload: BulkCreateQuestionsPayload, { rejectWithValue }) => {
    try {
      const response = await bulkCreateQuestions(payload);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to add questions");
    }
  },
);

export const updateTestAsync = createAsyncThunk(
  "test/updateTest",
  async (
    { id, payload }: { id: string; payload: UpdateTestPayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateTest(id, payload);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update test");
    }
  },
);

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    resetTestState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.testCreated = false;
      state.createdTestId = null;
      state.currentTest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Test
      .addCase(createNewTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.testCreated = false;
      })
      .addCase(createNewTest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.testCreated = true;
        state.error = null;
    
        state.createdTestId = action.payload?.data?.id || null;
      })
      .addCase(createNewTest.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.testCreated = false;
        state.error = (action.payload as string) || "Failed to create test";
      })
      // Fetch All Tests
      .addCase(fetchAllTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload?.data || [];
        state.error = null;
      })
      .addCase(fetchAllTests.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch tests";
      })
      // Fetch Test By ID
      .addCase(fetchTestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload?.data || null;
        state.error = null;
      })
      .addCase(fetchTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch test";
      })
      // Bulk Add Questions
      .addCase(bulkAddQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bulkAddQuestions.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(bulkAddQuestions.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = (action.payload as string) || "Failed to add questions";
      })
      .addCase(updateTestAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTestAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateTestAsync.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = (action.payload as string) || "Failed to update test";
      });
  },
});

export const { resetTestState } = testSlice.actions;
export default testSlice.reducer;
