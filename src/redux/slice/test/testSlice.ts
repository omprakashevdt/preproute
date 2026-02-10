import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTest,
  type CreateTestPayload,
} from "../../service/test/Test.service";

interface TestState {
  loading: boolean;
  error: string | null;
  success: boolean;
  testCreated: boolean;
}

const initialState: TestState = {
  loading: false,
  error: null,
  success: false,
  testCreated: false,
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

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    resetTestState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.testCreated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.testCreated = false;
      })
      .addCase(createNewTest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.testCreated = true;
        state.error = null;
      })
      .addCase(createNewTest.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.testCreated = false;
        state.error = (action.payload as string) || "Failed to create test";
      });
  },
});

export const { resetTestState } = testSlice.actions;
export default testSlice.reducer;
