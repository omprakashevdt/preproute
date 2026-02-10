import apiClient from "../../apiClient";
import axios from "axios";

export interface CreateTestPayload {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: "easy" | "medium" | "hard";
  total_time: number;
  total_questions: number;
  total_marks: number;
  status: string | null;
}

export interface CreateTestResponse {
  status: string;
  message: string;
  data: unknown;
}

const extractServerMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? "Request failed";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Request failed";
};


export const createTest = async (
  payload: CreateTestPayload,
): Promise<CreateTestResponse> => {
  try {
    const response = await apiClient.post("/tests", payload);
    return response.data;
  } catch (error) {
    throw new Error(extractServerMessage(error));
  }
};
