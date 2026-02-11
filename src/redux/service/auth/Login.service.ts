import apiClient from "../../apiClient";
import axios from "axios";


export interface LoginPayload {
  userId: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    userId: string;
    name?: string;
    role?: string;
    subrole?: string | null;
    phone?: string;
    joiningDate?: string;
    endDate?: string;
    lastActive?: string;
    payment?: boolean;
  };
  message: string;
}
// Error message
const extractServerMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? "Login failed";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Login failed";
};

// Login function
export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post("/auth/login", payload);
    const { data, message } = response.data;

    if (!data?.token) {
      throw new Error("No authentication token received");
    }

    return {
      token: data.token,
      user: data.user,
      message: message || "Login successful",
    };
  } catch (error) {
    throw new Error(extractServerMessage(error));
  }
};
