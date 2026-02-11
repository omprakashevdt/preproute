import apiClient from "../../apiClient";
import axios from "axios";

export interface Subject {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface SubjectsResponse {
  status: string;
  message: string;
  data: Subject[];
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

export const getAllSubjects = async (): Promise<SubjectsResponse> => {
  try {
    const response = await apiClient.get("/subjects");
    return response.data;
  } catch (error) {
    throw new Error(extractServerMessage(error));
  }
};
