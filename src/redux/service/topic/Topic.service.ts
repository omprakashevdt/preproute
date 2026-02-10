import apiClient from "../../apiClient";
import axios from "axios";

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export interface TopicsResponse {
  success: boolean;
  data: Topic[];
}

export interface SubTopicsResponse {
  success: boolean;
  data: SubTopic[];
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

export const getTopicsBySubject = async (
  subjectId: string,
): Promise<TopicsResponse> => {
  try {
    const response = await apiClient.get<TopicsResponse>(
      `/topics/subject/${subjectId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(extractServerMessage(error));
  }
};

export const getSubTopicsByTopic = async (
  topicId: string,
): Promise<SubTopicsResponse> => {
  try {
    const response = await apiClient.get<SubTopicsResponse>(
      `/sub-topics/topic/${topicId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(extractServerMessage(error));
  }
};
