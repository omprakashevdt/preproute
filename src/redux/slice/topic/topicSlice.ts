import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTopicsBySubject,
  getSubTopicsByTopic,
  type Topic,
  type SubTopic,
} from "../../service/topic/Topic.service";

interface TopicState {
  topics: Topic[];
  subTopics: SubTopic[];
  loadingTopics: boolean;
  loadingSubTopics: boolean;
  error: string | null;
}

const initialState: TopicState = {
  topics: [],
  subTopics: [],
  loadingTopics: false,
  loadingSubTopics: false,
  error: null,
};

export const fetchTopics = createAsyncThunk(
  "topic/fetchTopics",
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const response = await getTopicsBySubject(subjectId);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch topics");
    }
  },
);

export const fetchSubTopics = createAsyncThunk(
  "topic/fetchSubTopics",
  async (topicIds: string[], { rejectWithValue }) => {
    try {
      const promises = topicIds.map((id) => getSubTopicsByTopic(id));
      const responses = await Promise.all(promises);
      // Flatten all subtopics from multiple topics
      const allSubTopics = responses.flatMap((res) => res.data);
      return allSubTopics;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch sub-topics");
    }
  },
);

const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    clearTopics: (state) => {
      state.topics = [];
    },
    clearSubTopics: (state) => {
      state.subTopics = [];
    },
  },
  extraReducers: (builder) => {
    // Topics
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loadingTopics = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loadingTopics = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loadingTopics = false;
        state.error = (action.payload as string) || "Failed to fetch topics";
      });

    // SubTopics
    builder
      .addCase(fetchSubTopics.pending, (state) => {
        state.loadingSubTopics = true;
        state.error = null;
      })
      .addCase(fetchSubTopics.fulfilled, (state, action) => {
        state.loadingSubTopics = false;
        // Merge with existing or replace? Usually replace based on selection.
        // But since we might select multiple topics and dispatch multiple times or once with array,
        // the thunk handles array. So we replace.
        state.subTopics = action.payload;
      })
      .addCase(fetchSubTopics.rejected, (state, action) => {
        state.loadingSubTopics = false;
        state.error =
          (action.payload as string) || "Failed to fetch sub-topics";
      });
  },
});

export const { clearTopics, clearSubTopics } = topicSlice.actions;
export default topicSlice.reducer;
