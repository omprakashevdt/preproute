import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice";
import subjectReducer from "./slice/subject/subjectSlice";
import testReducer from "./slice/test/testSlice";
import topicReducer from "./slice/topic/topicSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  subject: subjectReducer,
  test: testReducer,
  topic: topicReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
